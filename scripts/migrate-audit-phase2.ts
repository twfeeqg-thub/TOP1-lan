import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const REQUIRED_PORT = 6543;
const SQL_FILE = path.resolve(process.cwd(), 'scripts', 'migration_audit_phase2.sql');

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

    const auditColumns = await client.query<{ column_name: string; data_type: string }>(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'master_audit_log'
        ORDER BY ordinal_position;`
    );

    const outbox = await client.query<{ table_name: string }>(
      `SELECT table_name
         FROM information_schema.tables
        WHERE table_schema = 'core' AND table_name = 'master_outbox';`
    );
    if (outbox.rowCount === 0) {
      throw new Error('core.master_outbox not found after migration — injection failed.');
    }

    const outboxColumns = await client.query<{ column_name: string; data_type: string }>(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'master_outbox'
        ORDER BY ordinal_position;`
    );

    const sev = await client.query<{ severity: string; count: string }>(
      `SELECT severity, count(*)::int AS count FROM core.master_audit_log GROUP BY severity ORDER BY severity;`
    );

    await client.query('COMMIT');
    console.log('✅ SUCCESS — Phase 2 forensic schema injected & verified.');
    console.log('— core.master_audit_log —');
    console.table(auditColumns.rows);
    console.log('— core.master_outbox —');
    console.table(outboxColumns.rows);
    console.log('— Severity distribution (info/medium/high) —');
    console.table(sev.rows);

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
