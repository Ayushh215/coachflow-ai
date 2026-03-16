import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

async function initDb() {
    const connectionString = 'postgresql://postgres:postgres@localhost:5432/coaching_saas';

    console.log('🔌 Connecting to database...');
    const pool = new Pool({ connectionString });

    try {
        const schemaPath = join(__dirname, '..', 'src', 'lib', 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf-8');

        console.log('📋 Running schema...');
        await pool.query(schema);

        // Migrations for existing databases
        console.log('📋 Running migrations...');
        await pool.query(`ALTER TABLE owners ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id VARCHAR(255) UNIQUE`);
        await pool.query(`ALTER TABLE owners ADD COLUMN IF NOT EXISTS admin_phone VARCHAR(20)`);
        await pool.query(`ALTER TABLE owners ALTER COLUMN institute_name SET DEFAULT 'Coaching Institute'`);

        console.log('✅ Database initialized successfully!');
        console.log('\nTables created:');
        console.log('  - owners (with whatsapp_phone_number_id, admin_phone)');
        console.log('  - leads');
        console.log('  - conversations');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initDb();
