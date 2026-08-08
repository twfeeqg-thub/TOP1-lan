import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const REQUIRED_PORT = 6543;
const SQL_FILE = path.resolve(process.cwd(), 'scripts', 'migration_branding_feature.sql');

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

    const verified = await client.query<{ project_slug: string; flag: string | null }>(
      `SELECT project_slug,
              modules_config #>> '{feature,branding,custom_upload}' AS flag
         FROM core.project_definitions
        WHERE project_slug IN ('edu_schools','edu_exam','edu_twin','health_clinic')
        ORDER BY project_slug;`
    );

    if (verified.rowCount === 0) {
      throw new Error('No target project rows found — branding injection did not run.');
    }

    await client.query('COMMIT');
    console.log('✅ SUCCESS — Branding feature flag injected & verified.');
    console.table(
      verified.rows.map((r) => ({
        project_slug: r.project_slug,
        custom_upload: r.flag ?? '(missing)',
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
