import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me');

export interface AuthPayload {
    id: number;
    email: string;
    name: string;
    institute_name: string;
}

export async function signToken(payload: AuthPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as AuthPayload;
    } catch {
        return null;
    }
}

export async function getAuthOwner(): Promise<AuthPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
}
