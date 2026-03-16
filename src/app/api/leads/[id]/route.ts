import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthOwner } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const owner = await getAuthOwner();
    if (!owner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const updates: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        if (body.status) {
            updates.push(`status = $${paramIndex}`);
            values.push(body.status);
            paramIndex++;
        }
        if (body.student_name !== undefined) {
            updates.push(`student_name = $${paramIndex}`);
            values.push(body.student_name);
            paramIndex++;
        }
        if (body.class !== undefined) {
            updates.push(`class = $${paramIndex}`);
            values.push(body.class);
            paramIndex++;
        }
        if (body.course_interest !== undefined) {
            updates.push(`course_interest = $${paramIndex}`);
            values.push(body.course_interest);
            paramIndex++;
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id, owner.id);
        const result = await query(
            `UPDATE leads SET ${updates.join(', ')} WHERE id = $${paramIndex} AND owner_id = $${paramIndex + 1} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json({ lead: result.rows[0] });
    } catch (error) {
        console.error('Update lead error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const owner = await getAuthOwner();
    if (!owner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const result = await query(
        'DELETE FROM leads WHERE id = $1 AND owner_id = $2 RETURNING id',
        [id, owner.id]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lead deleted' });
}
