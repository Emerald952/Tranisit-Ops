const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'transitops_secret_key_change_in_production';
const JWT_EXPIRES_IN = '24h';

// MIDDLEWARE CONFIG
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

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

// AUTH ROUTES (public — no token required)

// POST /api/auth/login — Authenticate user, return JWT
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});


// AUTH MIDDLEWARE (protects all routes below)

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Apply auth middleware to all /api/* routes below this point
app.use('/api', authenticateToken);

// GET /api/auth/me — Get current user profile from token
app.get('/api/auth/me', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Auth/me error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});


// PROTECTED API ROUTES (token required)

// GET /api/dashboard — KPI counts
app.get('/api/dashboard', async (req, res) => {
  try {
    const [totalVehicles, availableVehicles, activeTrips] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM vehicles'),
      pool.query("SELECT COUNT(*)::int AS count FROM vehicles WHERE status = 'available'"),
      pool.query("SELECT COUNT(*)::int AS count FROM trips WHERE status = 'dispatched'"),
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

// POST /api/trips — Book a trip (transactional)
app.post('/api/trips', async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;

  // Basic payload check
  if (!source || !destination || !vehicle_id || !driver_id || !cargo_weight || !planned_distance) {
    return res.status(400).json({ error: 'All fields are required: source, destination, vehicle_id, driver_id, cargo_weight, planned_distance' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Validate Vehicle
    const vehicleResult = await client.query(
      'SELECT id, status, max_load_capacity FROM vehicles WHERE id = $1 FOR UPDATE',
      [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Vehicle not found' });
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.status !== 'available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Vehicle is not available (current status: ${vehicle.status})` });
    }

    if (parseFloat(cargo_weight) > parseFloat(vehicle.max_load_capacity)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Cargo weight (${cargo_weight} kg) exceeds vehicle capacity (${vehicle.max_load_capacity} kg)` });
    }

    // Validate Driver 
    const driverResult = await client.query(
      'SELECT id, status, license_expiry_date FROM drivers WHERE id = $1 FOR UPDATE',
      [driver_id]
    );

    if (driverResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Driver not found' });
    }

    const driver = driverResult.rows[0];

    if (driver.status !== 'available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Driver is not available (current status: ${driver.status})` });
    }

    if (new Date(driver.license_expiry_date) <= new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Driver license has expired' });
    }

    // All validations passed — execute writes
    const tripResult = await client.query(
      `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, dispatched_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'dispatched', NOW())
       RETURNING *`,
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance]
    );

    await client.query(
      "UPDATE vehicles SET status = 'on_trip' WHERE id = $1",
      [vehicle_id]
    );

    await client.query(
      "UPDATE drivers SET status = 'on_trip' WHERE id = $1",
      [driver_id]
    );

    await client.query('COMMIT');

    res.status(201).json(tripResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Trip creation error:', err.message);
    res.status(500).json({ error: 'Failed to create trip' });
  } finally {
    client.release();
  }
});

// API HEALTH CHECK
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 TransitOps server running on http://localhost:${PORT}`);
});
