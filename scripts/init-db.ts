import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

async function initDb() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/coaching_saas';

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
        await pool.query(`ALTER TABLE owners ADD COLUMN IF NOT EXISTS whatsapp_access_token VARCHAR(255)`);
        await pool.query(`ALTER TABLE owners ADD COLUMN IF NOT EXISTS admin_phone VARCHAR(20)`);
        await pool.query(`ALTER TABLE owners ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT TRUE`);
        await pool.query(`ALTER TABLE owners ALTER COLUMN institute_name SET DEFAULT 'Coaching Institute'`);
        await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'whatsapp'`);
        await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget VARCHAR(255)`);
        await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS timeline VARCHAR(255)`);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS institute_sites (
                id SERIAL PRIMARY KEY,
                owner_id INTEGER REFERENCES owners(id),
                slug VARCHAR(100) UNIQUE NOT NULL,
                institute_name VARCHAR(255),
                tagline VARCHAR(255),
                about_text TEXT,
                phone VARCHAR(20),
                address TEXT,
                courses JSONB DEFAULT '[]',
                testimonials JSONB DEFAULT '[]',
                results JSONB DEFAULT '[]',
                faculty JSONB DEFAULT '[]',
                primary_color VARCHAR(7) DEFAULT '#7C3AED',
                logo_text VARCHAR(5),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log('✅ Database initialized successfully!');
        console.log('\nTables created:');
        console.log('  - owners (with whatsapp_phone_number_id, whatsapp_access_token, admin_phone)');
        console.log('  - leads (with source)');
        console.log('  - conversations');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initDb();
