import { NextResponse } from 'next/server';
import { getAuthOwner } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
    const ownerFromToken = await getAuthOwner();
    if (!ownerFromToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await query('SELECT id, name, email, institute_name FROM owners WHERE id = $1', [ownerFromToken.id]);
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
        }
        return NextResponse.json({ owner: result.rows[0] });
    } catch (error) {
        console.error('Error fetching owner data:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
