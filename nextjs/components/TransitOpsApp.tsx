"use client";

import {
    AlertTriangle,
    BarChart3,
    Bell,
    CheckCircle2,
    ClipboardList,
    Download,
    Fuel,
    Gauge,
    Hammer,
    IndianRupee,
    Loader2,
    LayoutDashboard,
    Lock,
    LogOut,
    Menu,
    Moon,
    Plus,
    Search,
    Settings,
    ShieldCheck,
    Truck,
    UsersRound,
    Wrench,
    X,
    XCircle,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Role = "Fleet Manager" | "Driver" | "Safety Officer" | "Financial Analyst";
type View =
    | "Dashboard"
    | "Fleet"
    | "Drivers"
    | "Trips"
    | "Maintenance"
    | "Fuel & Expenses"
    | "Analytics"
    | "Settings";

const roleAccess: Record<Role, View[]> = {
    "Fleet Manager": ["Dashboard", "Fleet", "Drivers", "Maintenance", "Analytics", "Settings"],
    Driver: ["Dashboard", "Fleet", "Trips", "Settings"],
    "Safety Officer": ["Dashboard", "Drivers", "Trips", "Settings"],
    "Financial Analyst": ["Dashboard", "Fleet", "Fuel & Expenses", "Analytics", "Settings"],
};

const navItems: { view: View; icon: ReactNode; hint: string }[] = [
    { view: "Dashboard", icon: <LayoutDashboard size={18} />, hint: "KPIs, filters, and live trip overview" },
    { view: "Fleet", icon: <Truck size={18} />, hint: "Vehicle registry and status control" },
    { view: "Drivers", icon: <UsersRound size={18} />, hint: "Driver profiles, licenses, and safety scores" },
    { view: "Trips", icon: <ClipboardList size={18} />, hint: "Create, validate, dispatch, and complete trips" },
    { view: "Maintenance", icon: <Wrench size={18} />, hint: "Service logs and automatic In Shop status" },
    { view: "Fuel & Expenses", icon: <Fuel size={18} />, hint: "Fuel logs, tolls, expenses, and cost totals" },
    { view: "Analytics", icon: <BarChart3 size={18} />, hint: "ROI, efficiency, utilization, and CSV export" },
    { view: "Settings", icon: <Settings size={18} />, hint: "Depot preferences and RBAC matrix" },
];

// Static arrays removed in favor of React state

type CurrentUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
    permissions: string[];
};

function isRole(value: unknown): value is Role {
    return typeof value === "string" && value in roleAccess;
}

function statusClass(status: string) {
    if (status.includes("Available") || status === "Completed") return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    if (status.includes("Trip") || status === "Dispatched") return "bg-blue-100 text-blue-800 ring-blue-200";
    if (status.includes("Shop") || status === "Draft") return "bg-amber-100 text-amber-800 ring-amber-200";
    if (status.includes("Suspended") || status === "Retired" || status === "Cancelled") return "bg-rose-100 text-rose-800 ring-rose-200";
    return "bg-slate-100 text-slate-700 ring-slate-200";
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <section className={`rounded-lg border border-[#dfe4dc] bg-white shadow-sm ${className}`}>{children}</section>;
}

function TooltipButton({ children, tip, className = "", onClick }: { children: ReactNode; tip: string; className?: string; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`group relative inline-flex items-center justify-center rounded-md transition ${className}`}>
            {children}
            <span className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-30 w-max max-w-56 rounded-md bg-[#17201b] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                {tip}
            </span>
        </button>
    );
}

function Badge({ children, status }: { children: ReactNode; status: string }) {
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>{children}</span>;
}

function Field({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
            <div className={`min-h-10 rounded-md border px-3 py-2 text-sm ${danger ? "border-rose-300 bg-rose-50 text-rose-800" : "border-slate-200 bg-white text-slate-800"}`}>
                {value}
            </div>
        </label>
    );
}

function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f4f6f2] text-xs uppercase text-slate-500">
                    <tr>{headers.map((h) => <th key={h} className="whitespace-nowrap px-4 py-3 font-bold">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.map((row, index) => (
                        <tr key={index} className="transition hover:bg-emerald-50/60">
                            {row.map((cell, cellIndex) => <td key={cellIndex} className="whitespace-nowrap px-4 py-3 text-slate-700">{cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function TransitOpsApp() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [view, setView] = useState<View>("Dashboard");
    const [menuOpen, setMenuOpen] = useState(false);

    // Data State
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [trips, setTrips] = useState<any[]>([]);
    const [maintenance, setMaintenance] = useState<any[]>([]);
    const [fuelLogs, setFuelLogs] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);

    const fetchAllData = async () => {
        try {
            const [vehRes, drvRes, trpRes, mainRes, fuelRes] = await Promise.all([
                fetch('/api/vehicles').catch(() => null),
                fetch('/api/drivers').catch(() => null),
                fetch('/api/trips').catch(() => null),
                fetch('/api/maintenance').catch(() => null),
                fetch('/api/fuel').catch(() => null)
            ]);
            
            if (vehRes?.ok) { const data = await vehRes.json(); setVehicles(data.vehicles || []); }
            if (drvRes?.ok) { const data = await drvRes.json(); setDrivers(data.drivers || []); }
            if (trpRes?.ok) { const data = await trpRes.json(); setTrips(data.trips || []); }
            if (mainRes?.ok) { const data = await mainRes.json(); setMaintenance(data.maintenance || []); }
            if (fuelRes?.ok) { 
                const data = await fuelRes.json(); 
                setFuelLogs(data.fuelLogs || []); 
                setExpenses(data.expenses || []); 
            }
        } catch (error) {
            console.error('Data fetch error:', error);
        }
    };

    const exportToCSV = (data: any[], filename: string) => {
        if (!data || !data.length) return alert('No data to export');
        const keys = Object.keys(data[0]);
        const csvContent = [
            keys.join(','),
            ...data.map(row => keys.map(k => `"${String(row[k] || '').replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const [darkMode, setDarkMode] = useState(false);

    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [showAddDriver, setShowAddDriver] = useState(false);

    const handleAddVehicle = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        try {
            await fetch('/api/vehicles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            setShowAddVehicle(false);
            fetchAllData();
        } catch (error) { console.error('Failed to add vehicle', error); }
    };

    const handleAddDriver = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        try {
            await fetch('/api/drivers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            setShowAddDriver(false);
            fetchAllData();
        } catch (error) { console.error('Failed to add driver', error); }
    };

    const handleAddTrip = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        data.cargoWeight = Number(data.cargoWeight);
        try {
            const res = await fetch('/api/trips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (res.ok) { e.currentTarget.reset(); fetchAllData(); }
            else alert("Error: " + (await res.json()).error);
        } catch (error) { console.error('Failed to add trip', error); }
    };

    const handleAddMaintenance = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        try {
            await fetch('/api/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            e.currentTarget.reset();
            fetchAllData();
        } catch (error) { console.error('Failed to add maintenance', error); }
    };

    const [showAddFuel, setShowAddFuel] = useState(false);
    const handleAddFuel = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        try {
            await fetch('/api/fuel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            setShowAddFuel(false);
            fetchAllData();
        } catch (error) { console.error('Failed to add fuel', error); }
    };

    const [showAddExpense, setShowAddExpense] = useState(false);
    const handleAddExpense = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        try {
            await fetch('/api/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            setShowAddExpense(false);
            fetchAllData();
        } catch (error) { console.error('Failed to add expense', error); }
    };

    useEffect(() => {
        if (currentUser) {
            fetchAllData();
        }
    }, [currentUser, view]); // Refresh data when view changes

    const role = isRole(currentUser?.role) ? currentUser.role : "Driver";
    const access = roleAccess[role] ?? roleAccess.Driver;
    const activeView = access.includes(view) ? view : "Dashboard";
    const cargoWeight = 700;
    const selectedVehicle = vehicles[0] || { capacity: 0 };
    const capacityExceeded = cargoWeight > selectedVehicle.capacity;

    const kpis = useMemo(() => [
        ["Active Vehicles", "53", <Truck key="truck" size={18} />],
        ["Available Vehicles", "42", <CheckCircle2 key="available" size={18} />],
        ["Vehicles in Maintenance", "05", <Hammer key="maintenance" size={18} />],
        ["Active Trips", "18", <ClipboardList key="trips" size={18} />],
        ["Pending Trips", "09", <AlertTriangle key="pending" size={18} />],
        ["Drivers On Duty", "26", <UsersRound key="drivers" size={18} />],
        ["Fleet Utilization", "81%", <Gauge key="utilization" size={18} />],
    ], []);

    useEffect(() => {
        let active = true;

        async function loadSession() {
            try {
                const response = await fetch("/api/auth/me", { cache: "no-store" });
                if (!response.ok) {
                    if (active) setCurrentUser(null);
                    return;
                }
                const data = await response.json();
                if (active) setCurrentUser(data.user);
            } catch {
                if (active) setCurrentUser(null);
            } finally {
                if (active) setAuthLoading(false);
            }
        }

        loadSession();
        return () => {
            active = false;
        };
    }, []);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setCurrentUser(null);
        setView("Dashboard");
    }

    function selectView(nextView: View) {
        if (access.includes(nextView)) {
            setView(nextView);
            setMenuOpen(false);
        }
    }

    if (authLoading) {
        return (
            <main className="grid min-h-screen place-items-center bg-[#f4f6f2] text-[#17201b]">
                <div className="flex items-center gap-3 text-sm font-bold">
                    <Loader2 className="animate-spin" size={18} />
                    Checking secure session...
                </div>
            </main>
        );
    }

    if (!currentUser) {
        return <LoginScreen onLogin={setCurrentUser} />;
    }

    return (
        <main className={`min-h-screen bg-[#f4f6f2] transition-[filter] duration-500 ${darkMode ? 'invert hue-rotate-180' : ''}`}>
            <section className="flex min-h-screen">
                <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[#dbe1d6] bg-[#17201b] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                            <div>
                                <div className="text-xl font-black">TransitOps</div>
                                <div className="text-xs text-emerald-100">Smart Transport Operations</div>
                            </div>
                            <button className="rounded-md p-2 hover:bg-white/10 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                                <X size={18} />
                            </button>
                        </div>

                        <nav className="grid gap-1 px-3 py-4">
                            {navItems.map((item) => {
                                const allowed = access.includes(item.view);
                                const active = activeView === item.view;
                                return (
                                    <button
                                        key={item.view}
                                        onClick={() => selectView(item.view)}
                                        disabled={!allowed}
                                        title={allowed ? item.hint : `${role} does not have access`}
                                        className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${active ? "bg-emerald-400 text-[#17201b]" : allowed ? "text-emerald-50 hover:bg-white/10" : "cursor-not-allowed text-white/35"}`}
                                    >
                                        {item.icon}
                                        <span className="flex-1">{item.view}</span>
                                        {!allowed && <Lock size={14} />}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-auto border-t border-white/10 p-4">
                            <div className="rounded-lg bg-white/8 p-3">
                                <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                                    <ShieldCheck size={16} />
                                    RBAC enabled
                                </div>
                                <p className="text-xs leading-5 text-emerald-50/80">Navigation and screen actions are scoped by the selected role for demo clarity.</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-30 border-b border-[#dbe1d6] bg-white/95 backdrop-blur">
                        <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
                            <button className="rounded-md border border-slate-200 p-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                                <Menu size={19} />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-xl font-black text-[#17201b]">{activeView}</h1>
                                <p className="truncate text-xs text-slate-500">Gandhinagar Depot GJ4 · Live operations workspace</p>
                            </div>
                            <div className="hidden rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800 sm:block">
                                {role}
                            </div>
                            <TooltipButton tip="Notifications" className="h-10 w-10 border border-slate-200 hover:bg-emerald-50">
                                <Bell size={17} />
                            </TooltipButton>
                            <TooltipButton tip="Toggle Dark Mode" className="h-10 w-10 border border-slate-200 hover:bg-emerald-50" onClick={() => setDarkMode(!darkMode)}>
                                <Moon size={17} />
                            </TooltipButton>
                            <TooltipButton tip={`Logout ${currentUser.email}`} className="h-10 w-10 border border-slate-200 hover:bg-rose-50" onClick={handleLogout}>
                                <LogOut size={17} />
                            </TooltipButton>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17201b] text-sm font-black text-white">
                                {currentUser.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </header>

                    <div className="p-4 lg:p-6">
                        {activeView === "Dashboard" && (
                            <div className="grid gap-5">
                                <div className="grid gap-3 md:grid-cols-3">
                                    {["Vehicle Type: All", "Status: All", "Region: All"].map((filter) => (
                                        <button key={filter} className="flex min-h-11 items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50">
                                            {filter}<span>▾</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
                                    {kpis.map(([label, value, icon]) => (
                                        <Card key={label as string} className="p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
                                            <div className="mb-4 flex items-center justify-between text-emerald-700">
                                                <span className="rounded-md bg-emerald-50 p-2">{icon}</span>
                                            </div>
                                            <div className="text-2xl font-black text-[#17201b]">{value}</div>
                                            <div className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</div>
                                        </Card>
                                    ))}
                                </div>
                                <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
                                    <Card>
                                        <div className="flex items-center justify-between border-b border-slate-100 p-4">
                                            <h2 className="font-black">Recent Trips</h2>
                                            <Badge status="Dispatched">Live</Badge>
                                        </div>
                                        <DataTable headers={["Trip", "Vehicle", "Driver", "Status", "ETA"]} rows={trips.map((trip) => [trip.id, trip.vehicle, trip.driver, <Badge key={`${trip.id}-status`} status={trip.status}>{trip.status}</Badge>, trip.eta])} />
                                    </Card>
                                    <Card className="p-4">
                                        <h2 className="mb-4 font-black">Vehicle Status</h2>
                                        {["Available", "On Trip", "In Shop", "Retired"].map((item, index) => (
                                            <div key={item} className="mb-3">
                                                <div className="mb-1 flex justify-between text-sm font-semibold"><span>{item}</span><span>{[42, 11, 5, 3][index]}</span></div>
                                                <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${[78, 38, 22, 12][index]}%` }} /></div>
                                            </div>
                                        ))}
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeView === "Fleet" && (
                            <div className="grid gap-5">
                                <Toolbar title="Vehicle Registry" action="+ Add Vehicle" onAction={() => setShowAddVehicle(!showAddVehicle)} />
                                {showAddVehicle && (
                                    <Card className="p-4 bg-slate-50 border-emerald-200">
                                        <h3 className="font-bold mb-3 text-emerald-900">Register New Vehicle</h3>
                                        <form onSubmit={handleAddVehicle} className="flex gap-2 flex-wrap items-end">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Reg No.<input name="reg" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="GJ01XX0000" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Name<input name="name" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="VAN-10" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Type<input name="type" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="Van" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Capacity (kg)<input name="capacity" type="number" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="500" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Cost (Rs)<input name="cost" type="number" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="600000" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Region<input name="region" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="Ahmedabad" /></label>
                                            <button className="bg-[#17201b] hover:bg-emerald-800 text-white px-4 py-2 rounded font-black text-sm h-9 transition">Save Vehicle</button>
                                        </form>
                                    </Card>
                                )}
                                <Card>
                                    <DataTable
                                        headers={["Reg. No. (Unique)", "Name/Model", "Type", "Capacity", "Odometer", "Acq. Cost", "Status"]}
                                        rows={vehicles.map((vehicle) => [vehicle.reg, vehicle.name, vehicle.type, `${vehicle.capacity} kg`, vehicle.odometer, `Rs ${vehicle.cost}`, <Badge key={`${vehicle.reg}-status`} status={vehicle.status}>{vehicle.status}</Badge>])}
                                    />
                                </Card>
                                <Rule text="Registration number must be unique. Retired and In Shop vehicles are hidden from dispatch selection." />
                            </div>
                        )}

                        {activeView === "Drivers" && (
                            <div className="grid gap-5">
                                <Toolbar title="Drivers & Safety Profiles" action="+ Add Driver" onAction={() => setShowAddDriver(!showAddDriver)} />
                                {showAddDriver && (
                                    <Card className="p-4 bg-slate-50 border-emerald-200">
                                        <h3 className="font-bold mb-3 text-emerald-900">Add New Driver</h3>
                                        <form onSubmit={handleAddDriver} className="flex gap-2 flex-wrap items-end">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Name<input name="name" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="Raj" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">License No.<input name="license" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="DL-00000" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Category<input name="category" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="LMV" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Expiry<input name="expiry" required placeholder="12/2028" className="border p-2 mt-1 rounded text-sm w-full bg-white" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Contact<input name="contact" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="98989xxxxx" /></label>
                                            <button className="bg-[#17201b] hover:bg-emerald-800 text-white px-4 py-2 rounded font-black text-sm h-9 transition">Save Driver</button>
                                        </form>
                                    </Card>
                                )}
                                <Card>
                                    <DataTable
                                        headers={["Driver", "License No.", "Category", "Expiry", "Contact", "Trip Compl.", "Safety", "Status"]}
                                        rows={drivers.map((driver) => [driver.name, driver.license, driver.category, driver.expiry, driver.contact, driver.completion, `${driver.safety}%`, <Badge key={`${driver.license}-status`} status={driver.status}>{driver.status}</Badge>])}
                                    />
                                </Card>
                                <Rule text="Expired licenses or Suspended status block assignment. On Trip drivers cannot be assigned twice." />
                            </div>
                        )}

                        {activeView === "Trips" && (
                            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                                <Card className="p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="font-black">Create Trip</h2>
                                    </div>
                                    <form onSubmit={handleAddTrip}>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Source</span><input name="source" required className="border p-2 rounded text-sm w-full bg-white" placeholder="Depot A" /></label>
                                            <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Destination</span><input name="destination" required className="border p-2 rounded text-sm w-full bg-white" placeholder="Hub B" /></label>
                                            <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Vehicle (Registration)</span><select name="vehicleReg" required className="border p-2 rounded text-sm w-full bg-white"><option value="">Select...</option>{vehicles.filter(v => v.status === "Available").map(v => <option key={v.reg} value={v.reg}>{v.reg} ({v.capacity}kg)</option>)}</select></label>
                                            <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Driver (License)</span><select name="driverLicense" required className="border p-2 rounded text-sm w-full bg-white"><option value="">Select...</option>{drivers.filter(d => d.status === "Available").map(d => <option key={d.license} value={d.license}>{d.name} ({d.license})</option>)}</select></label>
                                            <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Cargo weight (kg)</span><input name="cargoWeight" type="number" required className="border p-2 rounded text-sm w-full bg-white" placeholder="500" /></label>
                                            <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Planned dist (km)</span><input name="plannedDistance" type="number" required className="border p-2 rounded text-sm w-full bg-white" placeholder="40" /></label>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <button className="min-h-10 rounded-md bg-[#17201b] hover:bg-emerald-800 text-white px-4 text-sm font-black transition">Dispatch Trip</button>
                                            <button type="reset" className="min-h-10 rounded-md border border-slate-200 px-4 text-sm font-black hover:bg-slate-50">Clear</button>
                                        </div>
                                    </form>
                                </Card>
                                <Card>
                                    <div className="border-b border-slate-100 p-4"><h2 className="font-black">Live Board</h2></div>
                                    <div className="grid gap-3 p-4">
                                        {trips.map((trip) => (
                                            <div key={trip.id} className="rounded-lg border border-slate-200 p-3 hover:border-emerald-300 hover:bg-emerald-50/50">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="font-black">{trip.id}</div>
                                                    <Badge status={trip.status}>{trip.status}</Badge>
                                                </div>
                                                <div className="mt-1 text-sm text-slate-600">{trip.vehicle} / {trip.driver}</div>
                                                <div className="text-sm text-slate-500">{trip.route}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <Rule text="On complete: odometer and fuel logs are captured, then vehicle and driver become Available." />
                                </Card>
                            </div>
                        )}

                        {activeView === "Maintenance" && (
                            <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                                <Card className="p-4">
                                    <h2 className="mb-4 font-black">Log Service Record</h2>
                                    <form onSubmit={handleAddMaintenance} className="grid gap-3">
                                        <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Vehicle (Reg)</span><select name="vehicleReg" required className="border p-2 rounded text-sm w-full bg-white"><option value="">Select...</option>{vehicles.map(v => <option key={v.reg} value={v.reg}>{v.reg}</option>)}</select></label>
                                        <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Service Type</span><input name="service" required className="border p-2 rounded text-sm w-full bg-white" placeholder="Oil Change" /></label>
                                        <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Cost (Rs)</span><input name="cost" type="number" required className="border p-2 rounded text-sm w-full bg-white" placeholder="2500" /></label>
                                        <label className="grid gap-1.5"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Status</span><select name="status" className="border p-2 rounded text-sm w-full bg-white"><option value="Active">Active (In Shop)</option><option value="Completed">Completed (Available)</option></select></label>
                                        <button className="mt-2 min-h-10 rounded-md bg-[#17201b] px-4 text-sm font-black text-white hover:bg-emerald-800 transition">Save Record</button>
                                    </form>
                                </Card>
                                <Card>
                                    <div className="border-b border-slate-100 p-4"><h2 className="font-black">Service Log</h2></div>
                                    <DataTable headers={["Vehicle", "Service", "Cost", "Status"]} rows={maintenance.map((item) => [item.vehicle, item.service, `Rs ${item.cost}`, <Badge key={`${item.vehicle}-${item.service}-status`} status={item.status}>{item.status}</Badge>])} />
                                    <Rule text="In Shop vehicles are removed from the dispatch pool until maintenance is closed." />
                                </Card>
                            </div>
                        )}

                        {activeView === "Fuel & Expenses" && (
                            <div className="grid gap-5">
                                <Toolbar title="Fuel & Expense Management" action="+ Log Fuel" onAction={() => setShowAddFuel(!showAddFuel)} secondary="+ Add Expense" onSecondary={() => setShowAddExpense(!showAddExpense)} />
                                {showAddExpense && (
                                    <Card className="p-4 bg-slate-50 border-emerald-200">
                                        <h3 className="font-bold mb-3 text-emerald-900">Add Expense</h3>
                                        <form onSubmit={handleAddExpense} className="flex gap-2 flex-wrap items-end">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Vehicle (Reg)<select name="vehicleReg" required className="border p-2 mt-1 rounded text-sm w-full bg-white"><option value="">Select...</option>{vehicles.map(v => <option key={v.reg} value={v.reg}>{v.reg}</option>)}</select></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Trip (Optional)<select name="tripNo" className="border p-2 mt-1 rounded text-sm w-full bg-white"><option value="">None</option>{trips.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}</select></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Type<select name="expenseType" required className="border p-2 mt-1 rounded text-sm w-full bg-white"><option value="Toll">Toll</option><option value="Maintenance">Maintenance</option><option value="Misc">Misc</option></select></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Amount (Rs)<input name="amount" type="number" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="500" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Note<input name="note" className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="Optional details..." /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Date<input name="date" type="date" required className="border p-2 mt-1 rounded text-sm w-full bg-white" /></label>
                                            <button className="bg-[#17201b] hover:bg-emerald-800 text-white px-4 py-2 rounded font-black text-sm h-9 transition">Save Expense</button>
                                        </form>
                                    </Card>
                                )}
                                {showAddFuel && (
                                    <Card className="p-4 bg-slate-50 border-emerald-200">
                                        <h3 className="font-bold mb-3 text-emerald-900">Log Fuel</h3>
                                        <form onSubmit={handleAddFuel} className="flex gap-2 flex-wrap items-end">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Vehicle (Reg)<select name="vehicleReg" required className="border p-2 mt-1 rounded text-sm w-full bg-white"><option value="">Select...</option>{vehicles.map(v => <option key={v.reg} value={v.reg}>{v.reg}</option>)}</select></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Liters<input name="liters" type="number" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="40" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Cost (Rs)<input name="cost" type="number" required className="border p-2 mt-1 rounded text-sm w-full bg-white" placeholder="3200" /></label>
                                            <label className="text-[11px] font-bold text-slate-500 uppercase">Date<input name="date" type="date" required className="border p-2 mt-1 rounded text-sm w-full bg-white" /></label>
                                            <button className="bg-[#17201b] hover:bg-emerald-800 text-white px-4 py-2 rounded font-black text-sm h-9 transition">Save Fuel Log</button>
                                        </form>
                                    </Card>
                                )}
                                <div className="grid gap-5 xl:grid-cols-2">
                                    <Card><div className="border-b border-slate-100 p-4 font-black">Fuel Logs</div><DataTable headers={["Vehicle", "Date", "Liters", "Fuel Cost"]} rows={fuelLogs.map((item) => [item.vehicle, item.date, item.liters, `Rs ${item.cost}`])} /></Card>
                                    <Card><div className="border-b border-slate-100 p-4 font-black">Other Expenses</div><DataTable headers={["Trip", "Vehicle", "Toll", "Other", "Maint.", "Total"]} rows={expenses.map((item) => [item.trip, item.vehicle, `Rs ${item.toll}`, `Rs ${item.other}`, `Rs ${item.maint}`, `Rs ${item.total}`])} /></Card>
                                </div>
                                <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                                    <div><div className="text-xs font-bold uppercase text-slate-500">Total Operational Cost (Auto)</div><div className="text-sm text-slate-500">Fuel + Maintenance</div></div>
                                    <div className="flex items-center gap-2 text-3xl font-black"><IndianRupee size={24} />34,070</div>
                                </Card>
                            </div>
                        )}

                        {activeView === "Analytics" && (
                            <div className="grid gap-5">
                                <Toolbar title="Reports & Analytics" action="Export CSV (Trips)" onAction={() => exportToCSV(trips, 'trips_report.csv')} icon={<Download size={16} />} />
                                <div className="grid gap-4 md:grid-cols-4">
                                    {[["Fuel Efficiency", "8.4 km/l"], ["Fleet Utilization", "81%"], ["Operational Cost", "Rs 34,070"], ["Vehicle ROI", "14.2%"]].map(([label, value]) => (
                                        <Card key={label} className="p-4"><div className="text-xs font-bold uppercase text-slate-500">{label}</div><div className="mt-2 text-2xl font-black">{value}</div></Card>
                                    ))}
                                </div>
                                <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                                    <Card className="p-4">
                                        <h2 className="mb-4 font-black">Monthly Revenue</h2>
                                        <div className="flex h-64 items-end gap-3">
                                            {[42, 58, 48, 72, 66, 88, 81].map((height, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-md bg-emerald-500" style={{ height: `${height}%` }} /><span className="text-xs text-slate-500">W{i + 1}</span></div>)}
                                        </div>
                                    </Card>
                                    <Card className="p-4">
                                        <h2 className="mb-4 font-black">Top Costliest Vehicles</h2>
                                        {["TRUCK-11", "MINI-03", "VAN-05"].map((item, index) => (
                                            <div key={item} className="mb-3 rounded-md border border-slate-200 p-3">
                                                <div className="flex justify-between font-bold"><span>{item}</span><span>#{index + 1}</span></div>
                                                <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: `${[88, 54, 36][index]}%` }} /></div>
                                            </div>
                                        ))}
                                        <Rule text="ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost" />
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeView === "Settings" && (
                            <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                                <Card className="p-4">
                                    <h2 className="mb-4 font-black">General</h2>
                                    <div className="grid gap-3">
                                        <Field label="Depot Name" value="Gandhinagar Depot GJ4" />
                                        <Field label="Currency" value="INR (Rs)" />
                                        <Field label="Distance Unit" value="Kilometers" />
                                    </div>
                                    <button className="mt-4 min-h-10 rounded-md bg-[#17201b] px-4 text-sm font-black text-white hover:bg-emerald-800">Save changes</button>
                                </Card>
                                <Card>
                                    <div className="border-b border-slate-100 p-4 font-black">Role-Based Access</div>
                                    <DataTable
                                        headers={["Role", "Fleet", "Drivers", "Trips", "Fuel/Exp.", "Analytics"]}
                                        rows={[
                                            ["Fleet Manager", "✓", "✓", "-", "-", "✓"],
                                            ["Driver", "view", "-", "✓", "-", "-"],
                                            ["Safety Officer", "-", "✓", "view", "-", "-"],
                                            ["Financial Analyst", "view", "-", "-", "✓", "✓"],
                                        ]}
                                    />
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

function LoginScreen({ onLogin }: { onLogin: (user: CurrentUser) => void }) {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("driver@transitops.in");
    const [password, setPassword] = useState("Transit@123");
    const [selectedRole, setSelectedRole] = useState<Role>("Driver");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mode === "login" ? { email, password } : { name, email, password, role: selectedRole }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Invalid credentials");
                return;
            }

            onLogin(data.user);
        } catch {
            setError("Login service is not reachable.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="grid min-h-screen bg-[#f4f6f2] lg:grid-cols-[0.9fr_1.1fr]">
            <section className="flex min-h-[42vh] flex-col justify-between bg-[#17201b] p-6 text-white lg:min-h-screen lg:p-10">
                <div>
                    <div className="text-2xl font-black">TransitOps</div>
                    <p className="mt-2 max-w-md text-sm leading-6 text-emerald-50/80">Smart Transport Operations Platform with secure email login and role-based access control.</p>
                </div>
                <div className="grid gap-3 text-sm text-emerald-50/80">
                    <div className="rounded-lg bg-white/8 p-4">
                        <div className="mb-2 flex items-center gap-2 font-black text-white"><ShieldCheck size={17} /> RBAC access</div>
                        <p>Fleet Manager, Driver, Safety Officer, and Financial Analyst each see only their allowed modules.</p>
                    </div>
                    <div className="text-xs">TRANSITOPS © 2026 · AUTHENTICATED ACCESS ONLY</div>
                </div>
            </section>

            <section className="flex items-center justify-center p-4 sm:p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6">
                        <h1 className="text-2xl font-black text-[#17201b]">{mode === "login" ? "Sign in to your account" : "Create your TransitOps account"}</h1>
                        <p className="mt-2 text-sm text-slate-500">Secure email/password access with role-based permissions.</p>
                    </div>

                    <div className="mb-5 grid grid-cols-2 rounded-md bg-[#f4f6f2] p-1 text-sm font-black">
                        <button type="button" onClick={() => setMode("login")} className={`min-h-9 rounded-md ${mode === "login" ? "bg-white shadow-sm" : "text-slate-500"}`}>Login</button>
                        <button type="button" onClick={() => setMode("signup")} className={`min-h-9 rounded-md ${mode === "signup" ? "bg-white shadow-sm" : "text-slate-500"}`}>Signup</button>
                    </div>

                    <div className="grid gap-4">
                        {mode === "signup" && (
                            <label className="grid gap-1.5">
                                <span className="text-xs font-black uppercase text-slate-500">Name</span>
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="min-h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500"
                                    type="text"
                                    autoComplete="name"
                                />
                            </label>
                        )}
                        <label className="grid gap-1.5">
                            <span className="text-xs font-black uppercase text-slate-500">Email</span>
                            <input
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="min-h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500"
                                type="email"
                                autoComplete="email"
                            />
                        </label>
                        <label className="grid gap-1.5">
                            <span className="text-xs font-black uppercase text-slate-500">Password</span>
                            <input
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="min-h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500"
                                type="password"
                                autoComplete="current-password"
                            />
                        </label>
                        {mode === "signup" && (
                            <div className="grid gap-2">
                                <span className="text-xs font-black uppercase text-slate-500">Target user</span>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {(["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"] as Role[]).map((roleOption) => (
                                        <button
                                            key={roleOption}
                                            type="button"
                                            onClick={() => setSelectedRole(roleOption)}
                                            className={`min-h-12 rounded-md border px-3 text-left text-sm font-black transition ${selectedRole === roleOption ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-slate-200 hover:bg-slate-50"}`}
                                        >
                                            {roleOption}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
                            {error}
                        </div>
                    )}

                    <button disabled={loading} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-black text-white transition hover:bg-emerald-800 disabled:opacity-60">
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {mode === "login" ? "Sign In" : "Create Account"}
                    </button>

                    <div className="mt-5 rounded-md bg-[#f4f6f2] p-3 text-xs leading-5 text-slate-600">
                        First run `npm run db:setup`, then sign up with any role. Existing demo emails can be created through signup.
                    </div>
                </form>
            </section>
        </main>
    );
}

function Toolbar({ title, action, secondary, icon, onAction, onSecondary }: { title: string; action: string; secondary?: string; icon?: ReactNode, onAction?: () => void, onSecondary?: () => void }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-[#17201b]">{title}</h2>
            <div className="flex flex-wrap gap-2">
                <button onClick={onAction} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-black text-white hover:bg-emerald-800 transition">
                    {icon ?? <Plus size={16} />}
                    {action}
                </button>
                {secondary && <button onClick={onSecondary} className="min-h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-black hover:bg-emerald-50 transition">{secondary}</button>}
            </div>
        </div>
    );
}

function Rule({ text }: { text: string }) {
    return (
        <div className="m-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
            Rule: {text}
        </div>
    );
}
