# TransitOps Team Runbook

## What this app currently contains

- A responsive TransitOps frontend built inside the existing Next.js app.
- Email/password authentication with a secure HTTP-only session cookie.
- Role-aware navigation for Fleet Manager, Driver, Safety Officer, and Financial Analyst.
- Mock data for vehicles, drivers, trips, maintenance, fuel logs, expenses, and analytics.
- Frontend business-rule demonstrations for dispatch capacity, driver/vehicle eligibility, maintenance status, and RBAC visibility.

## Demo login

Use any of these emails with password `Transit@123`:

- `fleet@transitops.in` - Fleet Manager
- `driver@transitops.in` - Driver
- `safety@transitops.in` - Safety Officer
- `finance@transitops.in` - Financial Analyst

The app tries PostgreSQL-backed users first. If the shared database is unreachable, it falls back to these demo users so the hackathon demo still works.

## Run locally

```bash
cd nextjs
npm install
npm run dev
```

Then open the local URL printed by Next.js, usually:

```bash
http://localhost:3000
```

## Where to work

- Main UI: `components/TransitOpsApp.tsx`
- Auth API: `app/api/auth/login`, `app/api/auth/me`, `app/api/auth/logout`
- Auth helpers: `lib/auth.ts`
- Page entry: `app/page.tsx`
- Global styles: `app/globals.css`
- Metadata/layout shell: `app/layout.tsx`

## Suggested team split

- Authentication/RBAC owner: connect real login and role persistence.
- Fleet owner: convert vehicle mock data into CRUD with database/API.
- Driver/Safety owner: driver CRUD, license-expiry rules, compliance alerts.
- Dispatch owner: trip creation, lifecycle transitions, status updates.
- Finance/Analytics owner: fuel logs, expenses, CSV/PDF export, charts.
