import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const REQUIRED_PORT = 6543;
const SQL_FILE = path.resolve(process.cwd(), 'scripts', 'migration_overrides.sql');

function fail(message: string, err?: unknown): never {
  console.error(`❌ ${message}`);
  if (err) console.error(err);
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) fail('DATABASE_URL missing from .env.local.');
if (!databaseUrl.includes(`:${REQUIRED_PORT}`)) {
  fail(
    `Refusing to run: DATABASE_URL must target the Supabase pooler port ${REQUIRED_PORT} ` +
      `(safeguard against direct/wrong-environment connections).`
  );
}
if (!fs.existsSync(SQL_FILE)) fail(`Migration SQL file not found: ${SQL_FILE}`);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function main(): Promise<void> {
  const client = await pool.connect();
  console.log('🔌 Connected to Supabase pooler (port 6543)...');

  try {
    await client.query('BEGIN');
    await client.query(fs.readFileSync(SQL_FILE, 'utf8'));

    const table = await client.query<{ table_name: string }>(
      `SELECT table_name
         FROM information_schema.tables
        WHERE table_schema = 'core' AND table_name = 'project_overrides';`
    );
    if (table.rowCount === 0) {
      throw new Error('core.project_overrides not found after migration — injection failed.');
    }

    const columns = await client.query<{ column_name: string; data_type: string }>(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'project_overrides'
        ORDER BY ordinal_position;`
    );

    await client.query('COMMIT');
    console.log(
      `✅ SUCCESS — core.project_overrides injected & verified (${columns.rows.length} columns).`
    );
    console.table(columns.rows);

    await pool.query(`NOTIFY pgrst, 'reload schema';`);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => undefined);
    fail('Migration FAILED — full transaction rolled back. No partial state left behind.', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
