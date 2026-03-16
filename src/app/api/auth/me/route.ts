import { NextResponse } from 'next/server';
import { getAuthOwner } from '@/lib/auth';

export async function GET() {
    const owner = await getAuthOwner();
    if (!owner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ owner });
}
