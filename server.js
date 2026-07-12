const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// MIDDLEWARE CONFIG
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION POOL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'transitops',
  password: 'postgres',
  port: 5432,
});

// Verify DB connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err.message));

// Make pool accessible to route files later
app.locals.pool = pool;

// API ROUTES 

// GET /api/dashboard — KPI counts
app.get('/api/dashboard', async (req, res) => {
  try {
    const [totalVehicles, availableVehicles, activeTrips] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM vehicles'),
      pool.query("SELECT COUNT(*)::int AS count FROM vehicles WHERE status = 'available'"),
      pool.query("SELECT COUNT(*)::int AS count FROM trips WHERE status IN ('in_progress', 'dispatched')"),
    ]);

    res.json({
      total_vehicles: totalVehicles.rows[0].count,
      available_vehicles: availableVehicles.rows[0].count,
      active_trips: activeTrips.rows[0].count,
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/vehicles — List all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Vehicles error:', err.message);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET /api/drivers — List all drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drivers ORDER BY safety_score DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Drivers error:', err.message);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// API HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ status: 'Server running' });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 TransitOps server running on http://localhost:${PORT}`);
});
