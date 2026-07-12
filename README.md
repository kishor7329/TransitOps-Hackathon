# TransitOps-Hackathon

TransitOps is a **Smart Transport Operations Platform** built to help logistics and fleet managers track vehicles, dispatch trips, monitor driver safety, and analyze operational costs—all from a single, role-based dashboard.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide React (Icons)
- **Backend:** Next.js API Routes (Node.js)
- **Database:** PostgreSQL (using the `pg` client)
- **Authentication:** Custom JWT-based authentication with Role-Based Access Control (RBAC)

---

## ✨ Features

- **Role-Based Access Control (RBAC):** Distinct views and permissions for Fleet Managers, Drivers, Safety Officers, and Financial Analysts.
- **Fleet Management:** Register vehicles, track their capacity, odometer readings, and current status (Available, On Trip, In Shop, Retired).
- **Driver Profiles:** Manage driver licenses, expiry dates, safety scores, and trip completion percentages.
- **Trip Dispatching:** Create trips with automatic vehicle capacity validation. Automatically updates driver and vehicle availability status.
- **Maintenance Logging:** Track service records and costs. Automatically flags vehicles as "In Shop" to prevent them from being dispatched.
- **Fuel & Expenses:** Log fuel consumption and other trip-related expenses (tolls, miscellaneous) to calculate total operational costs.
- **Analytics & Reporting:** View KPIs (Fleet Utilization, Fuel Efficiency, ROI) and export trip data directly to CSV.
- **Dark Mode:** High-contrast toggle for low-light environments.

---

## 📸 Platform Gallery

Here is a look at the TransitOps platform in action! *(Note: Save your uploaded screenshots into an `assets/` folder in your repository to display them here).*

### 1. Operations Dashboard
![Dashboard View - Dark Mode](./assets/dashboard.png)
*The main operations dashboard displaying real-time fleet KPIs, active trips, and vehicle availability statuses in a sleek dark mode interface.*

### 2. Fuel & Expenses Tracking
![Fuel & Expenses View](./assets/fuel_expenses.png)
*A comprehensive view of operational burn rates, tracking detailed fuel logs and maintenance expenses for every vehicle.*

### 3. Secure Authentication & RBAC
<div align="center">
  <img src="./assets/login.png" width="45%" alt="Login Page" />
  <img src="./assets/signup.png" width="45%" alt="Signup Page" />
</div>
*Secure login and signup portals demonstrating Role-Based Access Control (RBAC). Users are strictly scoped to their designated roles (e.g., Fleet Manager, Driver, Financial Analyst).*

---

## 🗄️ Database Schema

The application relies on a robust PostgreSQL relational database:

1. **`roles`**: Defines system access levels (`Fleet Manager`, `Driver`, `Safety Officer`, `Financial Analyst`).
2. **`users`**: Secure user accounts with hashed passwords, tied to a specific role.
3. **`vehicles`**: The fleet registry containing registration numbers, max load capacity, acquisition costs, and current availability status.
4. **`drivers`**: Personnel registry tracking licenses, contact info, and computed safety scores.
5. **`trips`**: Links vehicles and drivers for deliveries. Tracks cargo weight, distances, revenue, and status (Draft, Dispatched, Completed, Cancelled).
6. **`maintenance_logs`**: Service histories mapped to specific vehicles, tracking costs and active shop time.
7. **`fuel_logs` & `expenses`**: Financial tracking tables linked to vehicles (and optionally specific trips) to monitor operational burn rate.

*(The full raw SQL schema can be found in `nextjs/database/schema.sql`)*

---

## 📁 Project Structure

Since Next.js is a full-stack framework, both frontend and backend live in the same repository. Here is how they are logically separated:

```text
TransitOps-Hackathon/
├── nextjs/
│
│   # 🖥️ FRONTEND (UI, Layouts, & Styling)
│   ├── app/
│   │   ├── globals.css       # Global Tailwind styles & dark mode filters
│   │   ├── layout.tsx        # Root HTML layout
│   │   └── page.tsx          # Main entry point
│   ├── components/
│   │   └── TransitOpsApp.tsx # The core interactive dashboard UI
│
│   # ⚙️ BACKEND (APIs, Database, & Auth)
│   ├── app/
│   │   └── api/              # Backend API routes (CRUD for vehicles, trips, etc.)
│   ├── database/
│   │   └── schema.sql        # PostgreSQL table initialization script
│   ├── lib/
│   │   ├── db.ts             # PostgreSQL connection pool and queries
│   │   └── auth.ts           # JWT session management utilities
│
│   # 🔧 CONFIG & ENVIRONMENT
│   ├── .env                  # Environment variables (DB URL, Secrets)
│   └── package.json          # Node.js dependencies and scripts
└── .gitignore                # Git ignore rules
```

---

## 🛠️ Getting Started

Follow these steps to run the platform locally:

**1. Clone the repository and enter the directory:**
```bash
cd TransitOps-Hackathon/nextjs
```

**2. Setup Environment Variables:**
Create a `.env` file in the `nextjs` folder and add your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
```

**3. Install Dependencies:**
```bash
npm install
```

**4. Initialize the Database:**
Ensure your PostgreSQL instance is running, then execute the setup script to create tables and roles:
```bash
npm run db:setup
```

**5. Start the Development Server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can create a new account through the signup screen and select your desired role to explore the dashboard!

---

## 📄 License & Credits

This project includes UI design inspiration from the **Pixel.io** Next.js template by PrebuiltUI (See `LICENSE.txt` for specific template usage terms).