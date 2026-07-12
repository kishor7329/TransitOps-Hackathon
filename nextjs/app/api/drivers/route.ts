import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query(`
            SELECT name, license_no as license, license_category as category, 
                   TO_CHAR(license_expiry_date, 'MM/YYYY') as expiry, 
                   contact_number as contact, trip_completion_pct as completion, 
                   safety_score as safety, status 
            FROM drivers
            ORDER BY created_at DESC
        `);
        return NextResponse.json({ drivers: result.rows.map(d => ({...d, completion: d.completion + '%'})) });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, license, category, expiry, contact } = body;
        
        if (!name || !license || !category || !expiry || !contact) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Expiry should be YYYY-MM-DD for PG
        // If they provide MM/YYYY, we convert to YYYY-MM-01
        const [month, year] = expiry.split('/');
        const expiryDate = `${year}-${month}-01`;

        const result = await query(`
            INSERT INTO drivers (name, license_no, license_category, license_expiry_date, contact_number)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING name, license_no as license, license_category as category, 
                      TO_CHAR(license_expiry_date, 'MM/YYYY') as expiry, 
                      contact_number as contact, trip_completion_pct as completion, 
                      safety_score as safety, status
        `, [name, license, category, expiryDate, contact]);

        const newDriver = result.rows[0];
        return NextResponse.json({ driver: { ...newDriver, completion: newDriver.completion + '%' } });
    } catch (error) {
        console.error('Error creating driver:', error);
        return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
    }
}
