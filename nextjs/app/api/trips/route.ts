import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query(`
            SELECT t.trip_no as id, 
                   v.vehicle_name as vehicle, 
                   d.name as driver, 
                   t.source || ' -> ' || t.destination as route, 
                   t.status, 
                   'TBD' as eta
            FROM trips t
            LEFT JOIN vehicles v ON t.vehicle_id = v.id
            LEFT JOIN drivers d ON t.driver_id = d.id
            ORDER BY t.created_at DESC
        `);
        return NextResponse.json({ trips: result.rows });
    } catch (error) {
        console.error('Error fetching trips:', error);
        return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { source, destination, vehicleReg, driverLicense, cargoWeight, plannedDistance } = body;
        
        // Lookup vehicle_id and driver_id
        const vehicleRes = await query('SELECT id, max_load_kg FROM vehicles WHERE registration_no = $1', [vehicleReg]);
        const driverRes = await query('SELECT id FROM drivers WHERE license_no = $1', [driverLicense]);
        
        if (!vehicleRes.rows.length || !driverRes.rows.length) {
            return NextResponse.json({ error: 'Invalid vehicle or driver' }, { status: 400 });
        }
        
        const vehicle = vehicleRes.rows[0];
        if (cargoWeight > vehicle.max_load_kg) {
            return NextResponse.json({ error: 'Capacity exceeded' }, { status: 400 });
        }

        const tripNo = 'TR' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        const result = await query(`
            INSERT INTO trips (trip_no, source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'Dispatched')
            RETURNING trip_no as id, source || ' -> ' || destination as route, status, 'TBD' as eta
        `, [tripNo, source, destination, vehicle.id, driverRes.rows[0].id, cargoWeight, plannedDistance]);

        // Update vehicle and driver status
        await query(`UPDATE vehicles SET status = 'On Trip' WHERE id = $1`, [vehicle.id]);
        await query(`UPDATE drivers SET status = 'On Trip' WHERE id = $1`, [driverRes.rows[0].id]);

        // return the new trip merged with string values for frontend
        const newTrip = result.rows[0];
        return NextResponse.json({ 
            trip: {
                ...newTrip,
                vehicle: vehicleReg,
                driver: driverLicense
            }
        });
    } catch (error) {
        console.error('Error creating trip:', error);
        return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
    }
}
