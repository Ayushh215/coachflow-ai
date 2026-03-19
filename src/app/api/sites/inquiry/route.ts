import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { slug, student_name, parent_phone, class_level, course_interest } = body;

        if (!slug || !student_name || !parent_phone || !class_level || !course_interest) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Look up the owner_id from institute_sites
        const siteResult = await db.query('SELECT owner_id FROM institute_sites WHERE slug = $1', [slug]);
        
        if (siteResult.rows.length === 0) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 });
        }
        
        const owner_id = siteResult.rows[0].owner_id;

        // Insert into leads
        const insertQuery = `
            INSERT INTO leads (
                student_name, parent_phone, "class", course_interest, source, owner_id
            ) VALUES (
                $1, $2, $3, $4, 'website', $5
            )
        `;
        
        await db.query(insertQuery, [
            student_name,
            parent_phone,
            class_level,
            course_interest,
            owner_id
        ]);

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error processing inquiry:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
