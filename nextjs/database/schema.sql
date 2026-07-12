create table if not exists roles (
    id serial primary key,
    name text not null unique,
    description text,
    created_at timestamptz not null default now()
);

insert into roles (name, description) values
    ('Fleet Manager', 'Oversees fleet assets, maintenance, lifecycle, and operational efficiency.'),
    ('Driver', 'Creates trips, assigns vehicles and drivers, and monitors active deliveries.'),
    ('Safety Officer', 'Ensures driver compliance, license validity, and safety scores.'),
    ('Financial Analyst', 'Reviews expenses, fuel consumption, maintenance costs, and profitability.')
on conflict (name) do update set description = excluded.description;

create table if not exists users (
    id serial primary key,
    name text not null,
    email text not null unique,
    password_hash text not null,
    role_id integer not null references roles(id),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists vehicles (
    id serial primary key,
    registration_no text not null unique,
    vehicle_name text not null,
    model text,
    vehicle_type text not null,
    max_load_kg integer not null check (max_load_kg > 0),
    odometer_km integer not null default 0 check (odometer_km >= 0),
    acquisition_cost numeric(12, 2) not null default 0,
    status text not null default 'Available' check (status in ('Available', 'On Trip', 'In Shop', 'Retired')),
    region text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists drivers (
    id serial primary key,
    name text not null,
    license_no text not null unique,
    license_category text not null,
    license_expiry_date date not null,
    contact_number text not null,
    safety_score integer not null default 100 check (safety_score between 0 and 100),
    trip_completion_pct integer not null default 0 check (trip_completion_pct between 0 and 100),
    status text not null default 'Available' check (status in ('Available', 'On Trip', 'Off Duty', 'Suspended')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists trips (
    id serial primary key,
    trip_no text not null unique,
    source text not null,
    destination text not null,
    vehicle_id integer references vehicles(id),
    driver_id integer references drivers(id),
    cargo_weight_kg integer not null check (cargo_weight_kg > 0),
    planned_distance_km integer not null check (planned_distance_km > 0),
    actual_distance_km integer,
    final_odometer_km integer,
    revenue numeric(12, 2) not null default 0,
    status text not null default 'Draft' check (status in ('Draft', 'Dispatched', 'Completed', 'Cancelled')),
    cancellation_reason text,
    dispatched_at timestamptz,
    completed_at timestamptz,
    cancelled_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists maintenance_logs (
    id serial primary key,
    vehicle_id integer not null references vehicles(id),
    service_type text not null,
    cost numeric(12, 2) not null default 0,
    notes text,
    status text not null default 'Active' check (status in ('Active', 'Completed')),
    opened_at timestamptz not null default now(),
    closed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists fuel_logs (
    id serial primary key,
    vehicle_id integer not null references vehicles(id),
    trip_id integer references trips(id),
    liters numeric(10, 2) not null check (liters > 0),
    cost numeric(12, 2) not null default 0,
    log_date date not null,
    created_at timestamptz not null default now()
);

create table if not exists expenses (
    id serial primary key,
    vehicle_id integer not null references vehicles(id),
    trip_id integer references trips(id),
    expense_type text not null check (expense_type in ('Toll', 'Maintenance', 'Misc')),
    amount numeric(12, 2) not null default 0,
    note text,
    expense_date date not null,
    created_at timestamptz not null default now()
);
