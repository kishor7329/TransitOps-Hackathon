import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query(`
            SELECT v.vehicle_name as vehicle, 
                   m.service_type as service, 
                   m.cost, 
                   m.status
            FROM maintenance_logs m
            JOIN vehicles v ON m.vehicle_id = v.id
            ORDER BY m.created_at DESC
        `);
        return NextResponse.json({ maintenance: result.rows });
    } catch (error) {
        console.error('Error fetching maintenance:', error);
        return NextResponse.json({ error: 'Failed to fetch maintenance logs' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { vehicleReg, service, cost, status } = body;
        
        const vehicleRes = await query('SELECT id FROM vehicles WHERE registration_no = $1', [vehicleReg]);
        if (!vehicleRes.rows.length) {
            return NextResponse.json({ error: 'Invalid vehicle' }, { status: 400 });
        }
        const vehicleId = vehicleRes.rows[0].id;

        const result = await query(`
            INSERT INTO maintenance_logs (vehicle_id, service_type, cost, status)
            VALUES ($1, $2, $3, $4)
            RETURNING service_type as service, cost, status
        `, [vehicleId, service, cost, status || 'Active']);

        if (status === 'Active') {
            await query(`UPDATE vehicles SET status = 'In Shop' WHERE id = $1`, [vehicleId]);
        } else if (status === 'Completed') {
            await query(`UPDATE vehicles SET status = 'Available' WHERE id = $1 AND status = 'In Shop'`, [vehicleId]);
        }

        return NextResponse.json({ maintenance: { ...result.rows[0], vehicle: vehicleReg } });
    } catch (error) {
        console.error('Error creating maintenance:', error);
        return NextResponse.json({ error: 'Failed to log maintenance' }, { status: 500 });
    }
}
