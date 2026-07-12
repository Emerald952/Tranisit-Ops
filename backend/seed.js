const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// PostgreSQL Connection 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'transitops',
  password: 'postgres',
  port: 5432,
});

const SALT_ROUNDS = 10;

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('🌱 Seeding started...\n');

    await client.query(`
      TRUNCATE expenses, fuel_logs, maintenance_logs, trips, drivers, vehicles, users
      RESTART IDENTITY CASCADE
    `);
    console.log('🧹 Tables truncated');

    // Users 
    const password = await bcrypt.hash('password123', SALT_ROUNDS);

    const usersData = [
      ['Alice',    'fleet@transitops.com',   password, 'fleet_manager'],
      ['Bob',     'driver@transitops.com',  password, 'driver'],
      ['Eve',      'safety@transitops.com',  password, 'safety_officer'],
      ['Trent',      'finance@transitops.com', password, 'financial_analyst'],
    ];

    for (const [full_name, email, hash, role] of usersData) {
      await client.query(
        `INSERT INTO users (full_name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)`,
        [full_name, email, hash, role]
      );
    }
    console.log(`✅ Users seeded (${usersData.length})`);

    // Vehicles 
    const vehiclesData = [
      // [registration_number, name_model, type, max_load_capacity, odometer, acquisition_cost, status, region]
      ['MH-12-AB-1234', 'Tata Ace Gold',       'truck', 1500,  45200, 850000,  'available', 'Maharashtra'],
      ['KA-01-CD-5678', 'Ashok Leyland Dost',  'truck', 2500,  78300, 1200000, 'on_trip',   'Karnataka'],
      ['DL-10-EF-9012', 'Maruti Eeco Cargo',   'van',   700,   32100, 520000,  'available', 'Delhi NCR'],
      ['TN-07-GH-3456', 'Force Traveller',     'bus',   3000,  95600, 1800000, 'in_shop',   'Tamil Nadu'],
      ['GJ-05-IJ-7890', 'Mahindra Bolero Pickup', 'car', 1000, 61400, 780000,  'available', 'Gujarat'],
      ['RJ-14-KL-2345', 'BharatBenz 1015R',    'truck', 5000,  120800, 2500000, 'available', 'Rajasthan'],
      ['UP-32-MN-6789', 'Tata Winger',         'van',   800,   28900, 620000,  'on_trip',   'Uttar Pradesh'],
      ['MH-04-OP-1122', 'Eicher Pro 2049',     'truck', 4000,  88500, 1950000, 'available', 'Maharashtra'],
    ];

    for (const [reg, name, type, cap, odo, cost, status, region] of vehiclesData) {
      await client.query(
        `INSERT INTO vehicles (registration_number, name_model, type, max_load_capacity, odometer, acquisition_cost, status, region)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [reg, name, type, cap, odo, cost, status, region]
      );
    }
    console.log(`✅ Vehicles seeded (${vehiclesData.length})`);

    // Drivers 
    const vehicleIds = (await client.query('SELECT id FROM vehicles ORDER BY id')).rows;

    const driversData = [
      // [name, license_number, license_category, license_expiry_date, contact_number, safety_score, status]
      ['Suresh Yadav',   'DL-0420110012345', 'HMV',  '2027-03-15', '9876543210', 95.50, 'available'],
      ['Vikram Singh',   'KA-0520120067890', 'HMV',  '2026-11-30', '9876543211', 88.00, 'on_trip'],
      ['Mohammed Irfan', 'MH-1220130045678', 'LMV',  '2027-08-20', '9876543212', 92.75, 'available'],
      ['Ravi Patel',     'GJ-0120140023456', 'HMV',  '2026-09-10', '9876543213', 78.25, 'on_trip'],
      ['Deepak Chauhan', 'RJ-1420150089012', 'HMV',  '2027-05-25', '9876543214', 85.00, 'available'],
      ['Arjun Reddy',    'TN-0720160034567', 'LMV',  '2027-01-18', '9876543215', 91.30, 'off_duty'],
      ['Kiran Joshi',    'UP-3220170056789', 'HMV',  '2025-06-01', '9876543216', 60.00, 'suspended'],
    ];

    for (const [name, lic, cat, exp, phone, score, status] of driversData) {
      await client.query(
        `INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, lic, cat, exp, phone, score, status]
      );
    }
    console.log(`✅ Drivers seeded (${driversData.length})`);

    // Trips
    const tripsData = [
      // [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, actual_distance, fuel_consumed, final_odometer, dispatched_at, completed_at]
      ['Mumbai',    'Pune',       1, 1, 1200, 150,  'completed',  148,  18.5,  45348,  '2025-06-01 08:00', '2025-06-01 14:30'],
      ['Bangalore', 'Chennai',    2, 2, 2000, 350,  'dispatched', null, null,  null,   '2025-07-10 06:00', null],
      ['Delhi',     'Jaipur',     3, 3, 500,  280,  'completed',  275,  32.0,  32375,  '2025-05-20 07:00', '2025-05-20 16:00'],
      ['Ahmedabad', 'Surat',      5, 5, 800,  265,  'completed',  260,  28.5,  61660,  '2025-06-15 09:00', '2025-06-15 17:00'],
      ['Lucknow',   'Varanasi',   7, 4, 600,  320,  'dispatched', null, null,  null,   '2025-07-10 10:00', null],
      ['Mumbai',    'Nagpur',     1, 1, 1400, 780,  'completed',  785,  95.0,  46133,  '2025-06-25 05:00', '2025-06-26 08:00'],
      ['Jaipur',    'Udaipur',    6, 5, 3500, 395,  'completed',  400,  48.0,  121200, '2025-07-01 06:30', '2025-07-01 18:00'],
      ['Pune',      'Hyderabad',  8, 3, 3000, 560,  'draft',      null, null,  null,   null, null],
      ['Chennai',   'Coimbatore', 1, 1, 1000, 500,  'completed',  505,  60.0,  46638,  '2025-07-05 07:00', '2025-07-05 19:30'],
      ['Delhi',     'Agra',       3, 3, 650,  230,  'cancelled',  null, null,  null,   '2025-06-10 08:00', null],
    ];

    for (const [src, dest, vid, did, cargo, dist, status, adist, fuel, odo, disp, comp] of tripsData) {
      await client.query(
        `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, actual_distance, fuel_consumed, final_odometer, dispatched_at, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [src, dest, vid, did, cargo, dist, status, adist, fuel, odo, disp, comp]
      );
    }
    console.log(`✅ Trips seeded (${tripsData.length})`);

    // Maintenance Logs
    const maintenanceData = [
      // [vehicle_id, description, type, cost, status, started_at, closed_at]
      [4, 'Engine overheating — coolant system repair',  'engine_repair',    18500, 'active',  '2025-07-08 10:00', null],
      [1, 'Routine oil change at 45000 km',              'oil_change',       3200,  'closed',  '2025-05-28 09:00', '2025-05-28 12:00'],
      [2, 'Front brake pad replacement',                 'brake_service',    8500,  'closed',  '2025-06-20 10:00', '2025-06-20 16:00'],
      [6, 'All four tyres replaced — highway wear',      'tire_replacement', 32000, 'closed',  '2025-06-28 08:00', '2025-06-29 11:00'],
      [4, 'General service — filters and belts',         'general_service',  6500,  'closed',  '2025-04-15 09:00', '2025-04-15 17:00'],
    ];

    for (const [vid, desc, type, cost, status, started, closed] of maintenanceData) {
      await client.query(
        `INSERT INTO maintenance_logs (vehicle_id, description, type, cost, status, started_at, closed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [vid, desc, type, cost, status, started, closed]
      );
    }
    console.log(`✅ Maintenance logs seeded (${maintenanceData.length})`);

    // Fuel Logs
    const fuelData = [
      // [vehicle_id, trip_id, liters, cost, date]
      [1, 1,    18.5,  1850,  '2025-06-01'],
      [2, null,  45.0,  4500,  '2025-06-05'],
      [3, 3,    32.0,  3200,  '2025-05-20'],
      [5, 4,    28.5,  2850,  '2025-06-15'],
      [1, 6,    95.0,  9500,  '2025-06-25'],
      [6, 7,    48.0,  4800,  '2025-07-01'],
      [7, null,  35.0,  3500,  '2025-07-03'],
      [1, 9,    60.0,  6000,  '2025-07-05'],
      [8, null,  40.0,  4000,  '2025-07-06'],
      [3, null,  22.0,  2200,  '2025-07-08'],
      [2, 2,    50.0,  5000,  '2025-07-10'],
      [5, null,  30.0,  3000,  '2025-07-09'],
    ];

    for (const [vid, tid, liters, cost, date] of fuelData) {
      await client.query(
        `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, date)
         VALUES ($1, $2, $3, $4, $5)`,
        [vid, tid, liters, cost, date]
      );
    }
    console.log(`✅ Fuel logs seeded (${fuelData.length})`);

    // Expenses 
    const expensesData = [
      // [vehicle_id, trip_id, category, description, amount, date]
      [1, 1,    'toll',        'Mumbai–Pune Expressway toll',         350,    '2025-06-01'],
      [1, 6,    'toll',        'Mumbai–Nagpur NH44 tolls (multiple)', 1200,   '2025-06-25'],
      [2, null, 'insurance',   'Annual comprehensive insurance',      45000,  '2025-04-01'],
      [3, 3,    'toll',        'Delhi–Jaipur NH48 toll',              280,    '2025-05-20'],
      [4, null, 'maintenance', 'Emergency towing charges',            4500,   '2025-07-08'],
      [5, 4,    'toll',        'Ahmedabad–Surat expressway toll',     220,    '2025-06-15'],
      [6, 7,    'toll',        'Jaipur–Udaipur NH48 tolls',           450,    '2025-07-01'],
      [7, null, 'insurance',   'Third-party liability insurance',     12000,  '2025-03-15'],
      [1, 9,    'toll',        'Chennai–Coimbatore NH44 tolls',       380,    '2025-07-05'],
      [8, null, 'other',       'GPS tracking device installation',    8500,   '2025-06-20'],
    ];

    for (const [vid, tid, cat, desc, amount, date] of expensesData) {
      await client.query(
        `INSERT INTO expenses (vehicle_id, trip_id, category, description, amount, date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [vid, tid, cat, desc, amount, date]
      );
    }
    console.log(`✅ Expenses seeded (${expensesData.length})`);

    await client.query('COMMIT');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Login Credentials:');
    console.log('   Fleet Manager     → fleet@transitops.com   / password123');
    console.log('   Driver            → driver@transitops.com  / password123');
    console.log('   Safety Officer    → safety@transitops.com  / password123');
    console.log('   Financial Analyst → finance@transitops.com / password123');
    console.log('');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
    console.error(err.stack);
  } finally {
    client.release();
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

seed();
