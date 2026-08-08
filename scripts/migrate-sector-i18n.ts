import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const REQUIRED_PORT = 6543;
const SQL_FILE = path.resolve(process.cwd(), 'scripts', 'migration_sector_i18n.sql');

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

    const verified = await client.query<{ id: string; title_en: string | null }>(
      `SELECT id, full_data #>> '{hero,title_en}' AS title_en
         FROM core.sectors
        WHERE full_data ? 'hero'
        ORDER BY id;`
    );

    if (verified.rowCount === 0) {
      throw new Error('No hero-bearing sector rows found — i18n injection did not run.');
    }

    await client.query('COMMIT');
    console.log('✅ SUCCESS — Sector i18n bilingual keys injected & verified.');
    console.table(
      verified.rows.map((r) => ({
        id: r.id,
        title_en: r.title_en ?? '(missing)',
      }))
    );

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
