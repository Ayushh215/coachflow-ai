import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const result = await query('SELECT * FROM owners WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const owner = result.rows[0];
        const validPassword = await bcrypt.compare(password, owner.password_hash);
        if (!validPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = await signToken({
            id: owner.id,
            email: owner.email,
            name: owner.name,
            institute_name: owner.institute_name,
        });

        const response = NextResponse.json(
            { message: 'Login successful', owner: { id: owner.id, name: owner.name, email: owner.email, institute_name: owner.institute_name } },
            { status: 200 }
        );

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
