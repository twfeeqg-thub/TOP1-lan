import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const REQUIRED_PORT = 6543;
const SQL_FILE = path.resolve(process.cwd(), 'scripts', 'migration_phase3.sql');

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

    const sectorsOrder = await client.query<{ column_name: string; data_type: string }>(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'sectors'
          AND column_name = 'display_order';`
    );

    const projectsOrder = await client.query<{ column_name: string; data_type: string }>(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'project_definitions'
          AND column_name = 'display_order';`
    );

    if (sectorsOrder.rowCount === 0) {
      throw new Error('core.sectors.display_order missing after migration — injection failed.');
    }
    if (projectsOrder.rowCount === 0) {
      throw new Error('core.project_definitions.display_order missing after migration — injection failed.');
    }

    const sectorsIndex = await client.query<{ indexname: string }>(
      `SELECT indexname
         FROM pg_indexes
        WHERE schemaname = 'core' AND tablename = 'sectors'
          AND indexname = 'idx_sectors_display_order';`
    );

    const projectsIndex = await client.query<{ indexname: string }>(
      `SELECT indexname
         FROM pg_indexes
        WHERE schemaname = 'core' AND tablename = 'project_definitions'
          AND indexname = 'idx_project_definitions_display_order';`
    );

    if (sectorsIndex.rowCount === 0 || projectsIndex.rowCount === 0) {
      throw new Error('Display-order B-Tree indexes missing after migration — injection failed.');
    }

    const sectorsCount = await client.query<{ count: string }>(
      'SELECT count(*)::text AS count FROM core.sectors;'
    );
    const projectsCount = await client.query<{ count: string }>(
      'SELECT count(*)::text AS count FROM core.project_definitions;'
    );

    await client.query('COMMIT');
    console.log('✅ SUCCESS — Phase 3 display-ordering schema injected & verified.');
    console.table([
      { table: 'core.sectors', column: sectorsOrder.rows[0]?.column_name, type: sectorsOrder.rows[0]?.data_type, index: sectorsIndex.rows[0]?.indexname, rows: sectorsCount.rows[0]?.count },
      { table: 'core.project_definitions', column: projectsOrder.rows[0]?.column_name, type: projectsOrder.rows[0]?.data_type, index: projectsIndex.rows[0]?.indexname, rows: projectsCount.rows[0]?.count },
    ]);

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
