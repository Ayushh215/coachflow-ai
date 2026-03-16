import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { name, email, password, institute_name, whatsapp_phone_number_id, admin_phone } = await request.json();

        if (!name || !email || !password || !institute_name) {
            return NextResponse.json(
                { error: 'All fields are required' },
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
            'INSERT INTO owners (name, email, password_hash, institute_name, whatsapp_phone_number_id, admin_phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, institute_name',
            [name, email, password_hash, institute_name, whatsapp_phone_number_id || null, admin_phone || null]
        );

        const owner = result.rows[0];
        const token = await signToken({
            id: owner.id,
            email: owner.email,
            name: owner.name,
            institute_name: owner.institute_name,
        });

        const response = NextResponse.json(
            { message: 'Account created successfully', owner: { id: owner.id, name: owner.name, email: owner.email, institute_name: owner.institute_name } },
            { status: 201 }
        );

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
