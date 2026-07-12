import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query(`
            SELECT registration_no as reg, vehicle_name as name, vehicle_type as type, 
                   max_load_kg as capacity, odometer_km as odometer, 
                   acquisition_cost as cost, status, region 
            FROM vehicles
            ORDER BY created_at DESC
        `);
        return NextResponse.json({ vehicles: result.rows });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { reg, name, type, capacity, cost, region } = body;
        
        if (!reg || !name || !type || !capacity || !cost || !region) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await query(`
            INSERT INTO vehicles (registration_no, vehicle_name, vehicle_type, max_load_kg, acquisition_cost, region)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING registration_no as reg, vehicle_name as name, vehicle_type as type, 
                      max_load_kg as capacity, odometer_km as odometer, 
                      acquisition_cost as cost, status, region
        `, [reg, name, type, capacity, cost, region]);

        return NextResponse.json({ vehicle: result.rows[0] });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
    }
}
