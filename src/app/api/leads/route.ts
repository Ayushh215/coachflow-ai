import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthOwner } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const owner = await getAuthOwner();
    if (!owner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM leads WHERE owner_id = $1';
    const params: unknown[] = [owner.id];
    let paramIndex = 2;

    if (status && status !== 'all') {
        sql += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }

    if (search) {
        sql += ` AND (student_name ILIKE $${paramIndex} OR parent_phone ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    // Get total count
    const countResult = await query(
        sql.replace('SELECT *', 'SELECT COUNT(*)'),
        params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return NextResponse.json({
        leads: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
}

export async function POST(request: Request) {
    const owner = await getAuthOwner();
    if (!owner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { student_name, parent_phone, class: studentClass, course_interest } = await request.json();

        if (!parent_phone) {
            return NextResponse.json(
                { error: 'Phone number is required' },
                { status: 400 }
            );
        }

        const result = await query(
            `INSERT INTO leads (owner_id, student_name, parent_phone, class, course_interest, status)
       VALUES ($1, $2, $3, $4, $5, 'new')
       ON CONFLICT (owner_id, parent_phone) DO UPDATE SET
         student_name = COALESCE(EXCLUDED.student_name, leads.student_name),
         class = COALESCE(EXCLUDED.class, leads.class),
         course_interest = COALESCE(EXCLUDED.course_interest, leads.course_interest)
       RETURNING *`,
            [owner.id, student_name, parent_phone, studentClass, course_interest]
        );

        return NextResponse.json({ lead: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create lead error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
