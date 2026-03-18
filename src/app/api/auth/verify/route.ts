import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.redirect(new URL('/login?error=missing_email', request.url));
    }

    try {
        await query('UPDATE owners SET email_verified = true WHERE email = $1', [email]);
        return NextResponse.redirect(new URL('/login?verified=true', request.url));
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.redirect(new URL('/login?error=verify_failed', request.url));
    }
}
