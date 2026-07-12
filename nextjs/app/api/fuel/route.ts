import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const fuelResult = await query(`
            SELECT v.vehicle_name as vehicle, 
                   TO_CHAR(f.log_date, 'DD Mon YYYY') as date, 
                   f.liters || ' L' as liters, 
                   f.cost
            FROM fuel_logs f
            JOIN vehicles v ON f.vehicle_id = v.id
            ORDER BY f.log_date DESC
        `);

        const expensesResult = await query(`
            SELECT t.trip_no as trip,
                   v.vehicle_name as vehicle, 
                   e.expense_type,
                   e.amount
            FROM expenses e
            JOIN vehicles v ON e.vehicle_id = v.id
            LEFT JOIN trips t ON e.trip_id = t.id
            ORDER BY e.expense_date DESC
        `);

        // Group expenses by trip/vehicle
        const groupedExpenses: any[] = [];
        // simple mapping since schema was simple
        expensesResult.rows.forEach(row => {
            groupedExpenses.push({
                trip: row.trip || '-',
                vehicle: row.vehicle,
                toll: row.expense_type === 'Toll' ? row.amount : 0,
                other: row.expense_type === 'Misc' ? row.amount : 0,
                maint: row.expense_type === 'Maintenance' ? row.amount : 0,
                total: row.amount
            });
        });

        return NextResponse.json({ 
            fuelLogs: fuelResult.rows,
            expenses: groupedExpenses
        });
    } catch (error) {
        console.error('Error fetching fuel/expenses:', error);
        return NextResponse.json({ error: 'Failed to fetch fuel/expenses logs' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { vehicleReg, liters, cost, date } = body;
        
        const vehicleRes = await query('SELECT id FROM vehicles WHERE registration_no = $1', [vehicleReg]);
        if (!vehicleRes.rows.length) {
            return NextResponse.json({ error: 'Invalid vehicle' }, { status: 400 });
        }
        const vehicleId = vehicleRes.rows[0].id;

        const result = await query(`
            INSERT INTO fuel_logs (vehicle_id, liters, cost, log_date)
            VALUES ($1, $2, $3, $4)
            RETURNING liters || ' L' as liters, cost, TO_CHAR(log_date, 'DD Mon YYYY') as date
        `, [vehicleId, liters, cost, date]);

        return NextResponse.json({ fuelLog: { ...result.rows[0], vehicle: vehicleReg } });
    } catch (error) {
        console.error('Error creating fuel log:', error);
        return NextResponse.json({ error: 'Failed to log fuel' }, { status: 500 });
    }
}
