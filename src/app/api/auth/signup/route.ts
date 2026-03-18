import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { name, email, password, institute_name, whatsapp_phone_number_id, whatsapp_access_token, admin_phone } = await request.json();

        if (!name || !email || !password || !institute_name) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Check if email exists
        const existing = await query('SELECT id FROM owners WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        const password_hash = await bcrypt.hash(password, 12);

        const result = await query(
            'INSERT INTO owners (name, email, password_hash, institute_name, whatsapp_phone_number_id, whatsapp_access_token, admin_phone, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING id, name, email, institute_name',
            [name, email, password_hash, institute_name, whatsapp_phone_number_id || null, whatsapp_access_token || null, admin_phone || null]
        );

        const owner = result.rows[0];

        // MOCK EMAIL VERIFICATION: Print verify URL to console
        const verifyUrl = `http://localhost:3000/api/auth/verify?email=${encodeURIComponent(owner.email)}`;
        console.log(`\n\n📧 MOCK EMAIL SENT:`);
        console.log(`To: ${owner.email}`);
        console.log(`Subject: Verify your CoachFlow AI account`);
        console.log(`Link: ${verifyUrl}\n\n`);

        return NextResponse.json(
            { message: 'Account created successfully. Please verify your email.', owner: { id: owner.id, name: owner.name, email: owner.email, institute_name: owner.institute_name } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
