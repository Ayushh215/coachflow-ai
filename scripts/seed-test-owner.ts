import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const PHONE_NUMBER_ID = '1049827054879399';

async function seedTestOwner() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/coaching_saas';
    console.log('🔌 Connecting to database...');
    const pool = new Pool({
        connectionString,
        ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
    });

    try {
        // Check if an owner with this phone_number_id already exists
        const existing = await pool.query(
            'SELECT id, name, email, institute_name FROM owners WHERE whatsapp_phone_number_id = $1',
            [PHONE_NUMBER_ID]
        );

        if (existing.rows.length > 0) {
            const owner = existing.rows[0];
            console.log(`✅ Owner already exists for phone_number_id ${PHONE_NUMBER_ID}:`);
            console.log(`   ID: ${owner.id}, Name: ${owner.name}, Email: ${owner.email}, Institute: ${owner.institute_name}`);
            return;
        }

        // Insert a test owner
        const passwordHash = await bcrypt.hash('testpassword123', 12);
        const result = await pool.query(
            `INSERT INTO owners (name, email, password_hash, institute_name, whatsapp_phone_number_id, admin_phone)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, email, institute_name`,
            [
                'Test Owner',
                'test@coachflow.ai',
                passwordHash,
                'CoachFlow Test Institute',
                PHONE_NUMBER_ID,
                process.env.ADMIN_PHONE || null,
            ]
        );

        const owner = result.rows[0];
        console.log(`✅ Test owner created successfully!`);
        console.log(`   ID: ${owner.id}`);
        console.log(`   Name: ${owner.name}`);
        console.log(`   Email: ${owner.email}`);
        console.log(`   Institute: ${owner.institute_name}`);
        console.log(`   WhatsApp Phone Number ID: ${PHONE_NUMBER_ID}`);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seedTestOwner();
