import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthOwner } from '@/lib/auth';

export async function GET() {
    const owner = await getAuthOwner();
    if (!owner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Total leads
        const totalResult = await query(
            'SELECT COUNT(*) FROM leads WHERE owner_id = $1',
            [owner.id]
        );
        const total = parseInt(totalResult.rows[0].count);

        // Leads today
        const todayResult = await query(
            `SELECT COUNT(*) FROM leads WHERE owner_id = $1 AND created_at >= CURRENT_DATE`,
            [owner.id]
        );
        const today = parseInt(todayResult.rows[0].count);

        // By status
        const statusResult = await query(
            `SELECT status, COUNT(*) as count FROM leads WHERE owner_id = $1 GROUP BY status`,
            [owner.id]
        );
        const byStatus: Record<string, number> = {
            new: 0,
            contacted: 0,
            demo_booked: 0,
            admitted: 0,
            not_interested: 0,
        };
        statusResult.rows.forEach((row: { status: string; count: string }) => {
            byStatus[row.status] = parseInt(row.count);
        });

        // Leads per day (last 7 days)
        const dailyResult = await query(
            `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM leads WHERE owner_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '6 days'
       GROUP BY DATE(created_at) ORDER BY date`,
            [owner.id]
        );

        // Recent leads
        const recentResult = await query(
            'SELECT * FROM leads WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 5',
            [owner.id]
        );

        return NextResponse.json({
            total,
            today,
            byStatus,
            daily: dailyResult.rows,
            recentLeads: recentResult.rows,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
