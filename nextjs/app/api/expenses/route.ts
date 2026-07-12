import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { vehicleReg, tripNo, expenseType, amount, note, date } = body;
        
        const vehicleRes = await query('SELECT id FROM vehicles WHERE registration_no = $1', [vehicleReg]);
        if (!vehicleRes.rows.length) {
            return NextResponse.json({ error: 'Invalid vehicle' }, { status: 400 });
        }
        const vehicleId = vehicleRes.rows[0].id;

        let tripId = null;
        if (tripNo) {
            const tripRes = await query('SELECT id FROM trips WHERE trip_no = $1', [tripNo]);
            if (tripRes.rows.length) {
                tripId = tripRes.rows[0].id;
            }
        }

        const result = await query(`
            INSERT INTO expenses (vehicle_id, trip_id, expense_type, amount, note, expense_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [vehicleId, tripId, expenseType, amount, note, date]);

        return NextResponse.json({ expense: result.rows[0] });
    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
    }
}
