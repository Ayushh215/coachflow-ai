import 'dotenv/config';
import { Pool } from 'pg';

async function seedDemoSite() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/coaching_saas';
    const pool = new Pool({ connectionString });

    try {
        console.log('🌱 Seeding demo institute site...');

        // Insert owner 1 if it doesn't exist
        await pool.query(`
            INSERT INTO owners (id, name, email, password_hash, institute_name)
            VALUES (1, 'Admin', 'demo@rajacademy.com', 'hashed_demo_pw', 'Raj Academy')
            ON CONFLICT (id) DO NOTHING
        `);

        const siteData = {
            owner_id: 1,
            slug: 'demo',
            institute_name: 'Raj Academy',
            tagline: 'Where Students Become Toppers',
            about_text: 'Raj Academy is a premier coaching institute dedicated to nurturing the next generation of engineers, doctors, and scholars. We provide top-tier guidance and comprehensive study material.',
            phone: '9999999999',
            address: '123 Education Street, Kanpur, Uttar Pradesh',
            primary_color: '#1D4ED8',
            logo_text: 'RA',
            courses: JSON.stringify([
                { name: 'JEE Preparation', description: 'Comprehensive preparation for JEE Main & Advanced.', fee: '₹8,000/month' },
                { name: 'NEET Coaching', description: 'Expert guidance and material for cracking NEET.', fee: '₹8,500/month' },
                { name: 'Class 10 Foundation', description: 'Strong foundational concepts for class 10 boards.', fee: '₹4,000/month' }
            ]),
            results: JSON.stringify([
                { student_name: 'Priya Sharma', exam: 'NEET', score: '650/720', year: '2024' },
                { student_name: 'Rahul Gupta', exam: 'JEE', score: 'AIR 245', year: '2024' },
                { student_name: 'Anjali Singh', exam: 'Class 10', score: '98%', year: '2024' }
            ]),
            testimonials: JSON.stringify([
                { text: 'Raj Academy transformed my child\'s approach to studying. Outstanding faculty!', name: 'Mr. Sharma', role: 'Parent' },
                { text: 'The regular mock tests and doubt clearing sessions are exactly what my son needed.', name: 'Mrs. Gupta', role: 'Parent' },
                { text: 'Highly recommend Raj Academy for anyone serious about engineering entrance exams.', name: 'Mr. Singh', role: 'Parent' }
            ]),
            faculty: JSON.stringify([
                { name: 'Mr. Rajesh Kumar', subject: 'Physics', experience: '12 years experience', initials: 'RK' },
                { name: 'Ms. Priya Singh', subject: 'Biology', experience: '8 years experience', initials: 'PS' }
            ])
        };

        const query = `
            INSERT INTO institute_sites (
                owner_id, slug, institute_name, tagline, about_text, phone, address,
                primary_color, logo_text, courses, results, testimonials, faculty
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            ) ON CONFLICT (slug) DO UPDATE SET
                institute_name = EXCLUDED.institute_name,
                tagline = EXCLUDED.tagline,
                about_text = EXCLUDED.about_text,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                primary_color = EXCLUDED.primary_color,
                logo_text = EXCLUDED.logo_text,
                courses = EXCLUDED.courses,
                results = EXCLUDED.results,
                testimonials = EXCLUDED.testimonials,
                faculty = EXCLUDED.faculty
        `;

        await pool.query(query, [
            siteData.owner_id, siteData.slug, siteData.institute_name, siteData.tagline, siteData.about_text,
            siteData.phone, siteData.address, siteData.primary_color, siteData.logo_text,
            siteData.courses, siteData.results, siteData.testimonials, siteData.faculty
        ]);

        console.log('✅ Demo site seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seedDemoSite();
