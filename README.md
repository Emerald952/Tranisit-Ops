# TransitOps — Smart Transport Operations Platform

TransitOps is a centralized fleet and transport operations platform that digitizes vehicle registration, driver management, trip dispatching, maintenance logs, fuel refilling, and operational expense tracking. 

Built as a lightweight, modular system for the Odoo Hackathon.

---

## 📂 Project Structure

```text
Transit-Ops/
├── backend/
│   ├── server.js          # Express backend serving dashboard/vehicles/drivers APIs
│   ├── db.sql             # PostgreSQL database schema & constraints
│   ├── seed.js            # Initial mock database seed script
│   ├── package.json       # Node.js backend dependencies
│   └── package-lock.json
├── frontend/
│   ├── index.html         # Single Page Application (SPA) shell
│   ├── css/
│   │   └── style.css      # Custom styling, Light/Dark theme configuration
│   └── js/
│       └── app.js         # Frontend controller, LocalStorage engine & Business logic
└── README.md              # Project documentation (this file)
```

---

## ✨ Features

- **Dynamic Dashboard**: Displays real-time KPIs (Active/Available Vehicles, In Maintenance, Active/Pending Trips, Drivers on Duty, and Fleet Utilization %).
- **Vehicle Registry**: CRUD operations for fleet vehicles, tracking load capacities, odometers, and active states.
- **Driver Rosters**: Profiles with license categories, safety scores, contact numbers, and license expiry checking.
- **Trip Lifecycle**: Dispatch, complete, or cancel trips. Automatically synchronizes vehicle/driver states.
- **Maintenance Logs**: Creates maintenance records, takes vehicles "In Shop", resolves repairs, and logs maintenance cost receipts.
- **Financial Refills & Expenses**: Log general expenses (tolls, insurance, maintenance, other) and fuel refill volumes.
- **Business Intelligence**: Computes overall fuel efficiency, operating costs, and calculates individual vehicle ROI: `[Revenue - (Maintenance + Fuel)] / Acquisition Cost`.
- **Role-Based Access Control (RBAC)**: Adjusts navigation views and controls based on login credentials.
- **Aesthetics & Dark Mode**: Modern slate-indigo theme supporting instant light/dark toggle and CSV exports.

---

## 🚦 Business Rules Enforced

1. **Unique Registrations**: Vehicle plates and driver licenses must be unique.
2. **Availability Check**: Vehicles *Retired* or *In Shop* and drivers *Suspended* or *Off Duty* are hidden from dispatch selectors.
3. **Expired Licenses**: Drivers with past-due licenses are blocked from new trips.
4. **Capacity Thresholds**: Prevents dispatching trips where the cargo weight exceeds the assigned vehicle's max load capacity.
5. **Odometer Tracking**: Odometer readings must increase on trip completion.
6. **Automatic Status Propagations**:
   - Dispatching a trip sets vehicle and driver statuses to `on_trip`.
   - Completing/cancelling a trip restores vehicle and driver statuses to `available`.
   - Logging maintenance sets vehicle status to `in_shop`. Closing maintenance restores vehicle to `available`.
   - Completing trips/closing maintenance auto-files corresponding fuel/maintenance expenses.

---

## 🚀 Getting Started

### Backend (Express & PostgreSQL)
1. Ensure you have **Node.js** and **PostgreSQL** installed.
2. Create a PostgreSQL database named `transitops`.
3. Load the schema:
   ```bash
   psql -U postgres -d transitops -f backend/db.sql
   ```
4. Install dependencies and run the seed script:
   ```bash
   cd backend
   npm install
   node seed.js
   ```
5. Start the API server:
   ```bash
   node server.js
   ```
   *(Runs on http://localhost:3000)*

### Frontend (Vanilla HTML/CSS/JS)
- The frontend is **completely serverless & client-side**. 
- Simply double-click **`frontend/index.html`** to open the app in any browser.
- **Note**: The frontend has an offline-first fallback. If your backend/PostgreSQL is not running, the application will initialize and run in local storage mock mode with all business rules fully interactive.

---

## 🔑 Demo Accounts & Roles

Log in using any of the pre-seeded accounts:

| Email | Password | Role | UI Permissions |
| :--- | :--- | :--- | :--- |
| `fleet@transitops.com` | `password123` | Fleet Manager | Full read/write access + maintenance + finance reports |
| `driver@transitops.com` | `password123` | Driver Dispatch | Create/complete trips, log fuel, log tolls (No reports) |
| `safety@transitops.com` | `password123` | Safety Officer | Manage driver directory, safety scores & compliance alerts |
| `finance@transitops.com` | `password123` | Financial Analyst | View expenses, fuel logs, and fleet ROI data (No CRUD writes) |
 
