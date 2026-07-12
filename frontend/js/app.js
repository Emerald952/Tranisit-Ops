// ==========================================
// TransitOps — Core Frontend Application Logic
// ==========================================

const API_BASE = 'http://localhost:3000/api';

// Fallback Mock Seed Data
const MOCK_VEHICLES = [
  { id: 1, registration_number: 'MH-12-AB-1234', name_model: 'Tata Ace Gold', type: 'truck', max_load_capacity: 1500, odometer: 46638, acquisition_cost: 850000, status: 'available', region: 'Maharashtra' },
  { id: 2, registration_number: 'KA-01-CD-5678', name_model: 'Ashok Leyland Dost', type: 'truck', max_load_capacity: 2500, odometer: 78300, acquisition_cost: 1200000, status: 'on_trip', region: 'Karnataka' },
  { id: 3, registration_number: 'DL-10-EF-9012', name_model: 'Maruti Eeco Cargo', type: 'van', max_load_capacity: 700, odometer: 32375, acquisition_cost: 520000, status: 'available', region: 'Delhi NCR' },
  { id: 4, registration_number: 'TN-07-GH-3456', name_model: 'Force Traveller', type: 'bus', max_load_capacity: 3000, odometer: 95600, acquisition_cost: 1800000, status: 'in_shop', region: 'Tamil Nadu' },
  { id: 5, registration_number: 'GJ-05-IJ-7890', name_model: 'Mahindra Bolero Pickup', type: 'car', max_load_capacity: 1000, odometer: 61660, acquisition_cost: 780000, status: 'available', region: 'Gujarat' },
  { id: 6, registration_number: 'RJ-14-KL-2345', name_model: 'BharatBenz 1015R', type: 'truck', max_load_capacity: 5000, odometer: 121200, acquisition_cost: 2500000, status: 'available', region: 'Rajasthan' },
  { id: 7, registration_number: 'UP-32-MN-6789', name_model: 'Tata Winger', type: 'van', max_load_capacity: 800, odometer: 28900, acquisition_cost: 620000, status: 'on_trip', region: 'Uttar Pradesh' },
  { id: 8, registration_number: 'MH-04-OP-1122', name_model: 'Eicher Pro 2049', type: 'truck', max_load_capacity: 4000, odometer: 88500, acquisition_cost: 1950000, status: 'available', region: 'Maharashtra' }
];

const MOCK_DRIVERS = [
  { id: 1, name: 'Suresh Yadav', license_number: 'DL-0420110012345', license_category: 'HMV', license_expiry_date: '2027-03-15', contact_number: '9876543210', safety_score: 95.50, status: 'available' },
  { id: 2, name: 'Vikram Singh', license_number: 'KA-0520120067890', license_category: 'HMV', license_expiry_date: '2026-11-30', contact_number: '9876543211', safety_score: 88.00, status: 'on_trip' },
  { id: 3, name: 'Mohammed Irfan', license_number: 'MH-1220130045678', license_category: 'LMV', license_expiry_date: '2027-08-20', contact_number: '9876543212', safety_score: 92.75, status: 'available' },
  { id: 4, name: 'Ravi Patel', license_number: 'GJ-0120140023456', license_category: 'HMV', license_expiry_date: '2026-09-10', contact_number: '9876543213', safety_score: 78.25, status: 'on_trip' },
  { id: 5, name: 'Deepak Chauhan', license_number: 'RJ-1420150089012', license_category: 'HMV', license_expiry_date: '2027-05-25', contact_number: '9876543214', safety_score: 85.00, status: 'available' },
  { id: 6, name: 'Arjun Reddy', license_number: 'TN-0720160034567', license_category: 'LMV', license_expiry_date: '2027-01-18', contact_number: '9876543215', safety_score: 91.30, status: 'off_duty' },
  { id: 7, name: 'Kiran Joshi', license_number: 'UP-3220170056789', license_category: 'HMV', license_expiry_date: '2025-06-01', contact_number: '9876543216', safety_score: 60.00, status: 'suspended' }
];

const MOCK_TRIPS = [
  { id: 1, source: 'Mumbai', destination: 'Pune', vehicle_id: 1, driver_id: 1, cargo_weight: 1200, planned_distance: 150, actual_distance: 148, fuel_consumed: 18.5, final_odometer: 45348, status: 'completed', dispatched_at: '2025-06-01 08:00', completed_at: '2025-06-01 14:30' },
  { id: 2, source: 'Bangalore', destination: 'Chennai', vehicle_id: 2, driver_id: 2, cargo_weight: 2000, planned_distance: 350, actual_distance: null, fuel_consumed: null, final_odometer: null, status: 'dispatched', dispatched_at: '2025-07-10 06:00', completed_at: null },
  { id: 3, source: 'Delhi', destination: 'Jaipur', vehicle_id: 3, driver_id: 3, cargo_weight: 500, planned_distance: 280, actual_distance: 275, fuel_consumed: 32.0, final_odometer: 32375, status: 'completed', dispatched_at: '2025-05-20 07:00', completed_at: '2025-05-20 16:00' },
  { id: 4, source: 'Ahmedabad', destination: 'Surat', vehicle_id: 5, driver_id: 5, cargo_weight: 800, planned_distance: 265, actual_distance: 260, fuel_consumed: 28.5, final_odometer: 61660, status: 'completed', dispatched_at: '2025-06-15 09:00', completed_at: '2025-06-15 17:00' },
  { id: 5, source: 'Lucknow', destination: 'Varanasi', vehicle_id: 7, driver_id: 4, cargo_weight: 600, planned_distance: 320, actual_distance: null, fuel_consumed: null, final_odometer: null, status: 'dispatched', dispatched_at: '2025-07-10 10:00', completed_at: null },
  { id: 6, source: 'Mumbai', destination: 'Nagpur', vehicle_id: 1, driver_id: 1, cargo_weight: 1400, planned_distance: 780, actual_distance: 785, fuel_consumed: 95.0, final_odometer: 46133, status: 'completed', dispatched_at: '2025-06-25 05:00', completed_at: '2025-06-26 08:00' },
  { id: 7, source: 'Jaipur', destination: 'Udaipur', vehicle_id: 6, driver_id: 5, cargo_weight: 3500, planned_distance: 395, actual_distance: 400, fuel_consumed: 48.0, final_odometer: 121200, status: 'completed', dispatched_at: '2025-07-01 06:30', completed_at: '2025-07-01 18:00' },
  { id: 8, source: 'Pune', destination: 'Hyderabad', vehicle_id: 8, driver_id: 3, cargo_weight: 3000, planned_distance: 560, actual_distance: null, fuel_consumed: null, final_odometer: null, status: 'draft', dispatched_at: null, completed_at: null },
  { id: 9, source: 'Chennai', destination: 'Coimbatore', vehicle_id: 1, driver_id: 1, cargo_weight: 1000, planned_distance: 500, actual_distance: 505, fuel_consumed: 60.0, final_odometer: 46638, status: 'completed', dispatched_at: '2025-07-05 07:00', completed_at: '2025-07-05 19:30' },
  { id: 10, source: 'Delhi', destination: 'Agra', vehicle_id: 3, driver_id: 3, cargo_weight: 650, planned_distance: 230, actual_distance: null, fuel_consumed: null, final_odometer: null, status: 'cancelled', dispatched_at: '2025-06-10 08:00', completed_at: null }
];

const MOCK_MAINTENANCE = [
  { id: 1, vehicle_id: 4, description: 'Engine overheating — coolant system repair', type: 'engine_repair', cost: 18500, status: 'active', started_at: '2025-07-08 10:00', closed_at: null },
  { id: 2, vehicle_id: 1, description: 'Routine oil change at 45000 km', type: 'oil_change', cost: 3200, status: 'closed', started_at: '2025-05-28 09:00', closed_at: '2025-05-28 12:00' },
  { id: 3, vehicle_id: 2, description: 'Front brake pad replacement', type: 'brake_service', cost: 8500, status: 'closed', started_at: '2025-06-20 10:00', closed_at: '2025-06-20 16:00' },
  { id: 4, vehicle_id: 6, description: 'All four tyres replaced — highway wear', type: 'tire_replacement', cost: 32000, status: 'closed', started_at: '2025-06-28 08:00', closed_at: '2025-06-29 11:00' },
  { id: 5, vehicle_id: 4, description: 'General service — filters and belts', type: 'general_service', cost: 6500, status: 'closed', started_at: '2025-04-15 09:00', closed_at: '2025-04-15 17:00' }
];

const MOCK_FUEL = [
  { id: 1, vehicle_id: 1, trip_id: 1, liters: 18.5, cost: 1850, date: '2025-06-01' },
  { id: 2, vehicle_id: 2, trip_id: null, liters: 45.0, cost: 4500, date: '2025-06-05' },
  { id: 3, vehicle_id: 3, trip_id: 3, liters: 32.0, cost: 3200, date: '2025-05-20' },
  { id: 4, vehicle_id: 5, trip_id: 4, liters: 28.5, cost: 2850, date: '2025-06-15' },
  { id: 5, vehicle_id: 1, trip_id: 6, liters: 95.0, cost: 9500, date: '2025-06-25' },
  { id: 6, vehicle_id: 6, trip_id: 7, liters: 48.0, cost: 4800, date: '2025-07-01' },
  { id: 7, vehicle_id: 7, trip_id: null, liters: 35.0, cost: 3500, date: '2025-07-03' },
  { id: 8, vehicle_id: 1, trip_id: 9, liters: 60.0, cost: 6000, date: '2025-07-05' },
  { id: 9, vehicle_id: 8, trip_id: null, liters: 40.0, cost: 4000, date: '2025-07-06' },
  { id: 10, vehicle_id: 3, trip_id: null, liters: 22.0, cost: 2200, date: '2025-07-08' },
  { id: 11, vehicle_id: 2, trip_id: 2, liters: 50.0, cost: 5000, date: '2025-07-10' },
  { id: 12, vehicle_id: 5, trip_id: null, liters: 30.0, cost: 3000, date: '2025-07-09' }
];

const MOCK_EXPENSES = [
  { id: 1, vehicle_id: 1, trip_id: 1, category: 'toll', description: 'Mumbai–Pune Expressway toll', amount: 350, date: '2025-06-01' },
  { id: 2, vehicle_id: 1, trip_id: 6, category: 'toll', description: 'Mumbai–Nagpur NH44 tolls (multiple)', amount: 1200, date: '2025-06-25' },
  { id: 3, vehicle_id: 2, trip_id: null, category: 'insurance', description: 'Annual comprehensive insurance', amount: 45000, date: '2025-04-01' },
  { id: 4, vehicle_id: 3, trip_id: 3, category: 'toll', description: 'Delhi–Jaipur NH48 toll', amount: 280, date: '2025-05-20' },
  { id: 5, vehicle_id: 4, trip_id: null, category: 'maintenance', description: 'Emergency towing charges', amount: 4500, date: '2025-07-08' },
  { id: 6, vehicle_id: 5, trip_id: 4, category: 'toll', description: 'Ahmedabad–Surat expressway toll', amount: 220, date: '2025-06-15' },
  { id: 7, vehicle_id: 6, trip_id: 7, category: 'toll', description: 'Jaipur–Udaipur NH48 tolls', amount: 450, date: '2025-07-01' },
  { id: 8, vehicle_id: 7, trip_id: null, category: 'insurance', description: 'Third-party liability insurance', amount: 12000, date: '2025-03-15' },
  { id: 9, vehicle_id: 1, trip_id: 9, category: 'toll', description: 'Chennai–Coimbatore NH44 tolls', amount: 380, date: '2025-07-05' },
  { id: 10, vehicle_id: 8, trip_id: null, category: 'other', description: 'GPS tracking device installation', amount: 8500, date: '2025-06-20' }
];

// App State
let state = {
  user: null,
  vehicles: [],
  drivers: [],
  trips: [],
  maintenance: [],
  expenses: [],
  fuel: [],
  activeView: 'dashboard',
  isUsingLiveBackend: false
};

// ==========================================
// 1. INITIALIZATION & DATA LOADING
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  setupEventListeners();
  
  // Try loading from live backend first
  await tryFetchBackendData();
  
  // Check auth session
  checkAuth();
});

// Try to fetch from backend, fallback to LocalStorage
async function tryFetchBackendData() {
  try {
    const response = await fetch(`${API_BASE}/vehicles`, { mode: 'cors' });
    if (response.ok) {
      const serverVehicles = await response.json();
      const driversResp = await fetch(`${API_BASE}/drivers`, { mode: 'cors' });
      const serverDrivers = driversResp.ok ? await driversResp.json() : [];
      
      console.log('✅ Connected to live backend server successfully!');
      state.isUsingLiveBackend = true;
      
      // If we haven't initialized localStorage with local additions, populate it with backend data
      if (!localStorage.getItem('transitops_initialized')) {
        localStorage.setItem('vehicles', JSON.stringify(serverVehicles));
        localStorage.setItem('drivers', JSON.stringify(serverDrivers));
        initializeRemainingMockData();
        localStorage.setItem('transitops_initialized', 'true');
        showToast('Connected to live server. Initialized database.', 'success');
      }
    } else {
      throw new Error('Backend responded with error');
    }
  } catch (err) {
    console.warn('⚠️ Backend connection failed. Running in Local Storage Mock mode.', err.message);
    state.isUsingLiveBackend = false;
    
    if (!localStorage.getItem('transitops_initialized')) {
      localStorage.setItem('vehicles', JSON.stringify(MOCK_VEHICLES));
      localStorage.setItem('drivers', JSON.stringify(MOCK_DRIVERS));
      initializeRemainingMockData();
      localStorage.setItem('transitops_initialized', 'true');
      showToast('Offline Database Initialized.', 'warning');
    }
  }
  
  // Load state from LocalStorage
  loadStateFromLocal();
}

function initializeRemainingMockData() {
  localStorage.setItem('trips', JSON.stringify(MOCK_TRIPS));
  localStorage.setItem('maintenance', JSON.stringify(MOCK_MAINTENANCE));
  localStorage.setItem('fuel', JSON.stringify(MOCK_FUEL));
  localStorage.setItem('expenses', JSON.stringify(MOCK_EXPENSES));
}

function loadStateFromLocal() {
  state.vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
  state.drivers = JSON.parse(localStorage.getItem('drivers')) || [];
  state.trips = JSON.parse(localStorage.getItem('trips')) || [];
  state.maintenance = JSON.parse(localStorage.getItem('maintenance')) || [];
  state.fuel = JSON.parse(localStorage.getItem('fuel')) || [];
  state.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
}

function saveStateToLocal() {
  localStorage.setItem('vehicles', JSON.stringify(state.vehicles));
  localStorage.setItem('drivers', JSON.stringify(state.drivers));
  localStorage.setItem('trips', JSON.stringify(state.trips));
  localStorage.setItem('maintenance', JSON.stringify(state.maintenance));
  localStorage.setItem('fuel', JSON.stringify(state.fuel));
  localStorage.setItem('expenses', JSON.stringify(state.expenses));
}

// ==========================================
// 2. AUTHENTICATION & RBAC
// ==========================================

function checkAuth() {
  const sessionUser = sessionStorage.getItem('transitops_user');
  if (sessionUser) {
    state.user = JSON.parse(sessionUser);
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    
    // Display header details
    document.getElementById('header-user-name').textContent = state.user.full_name;
    document.getElementById('header-user-role').textContent = formatRole(state.user.role);
    
    // Apply Role-Based Access controls
    applyRoleBasedUI(state.user.role);
    
    // Initial Render
    switchView(state.activeView);
  } else {
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
  }
}

function applyRoleBasedUI(role) {
  // Hide all element classes initially
  document.querySelectorAll('.manager-only').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.manager-safety-only').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.manager-driver-only').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.manager-driver-finance-only').forEach(el => el.style.display = 'none');
  
  // Show navigation items based on role
  const reportsNavItem = document.querySelector('.nav-item[data-view="reports"]');
  const expensesNavItem = document.querySelector('.nav-item[data-view="expenses"]');
  const maintNavItem = document.querySelector('.nav-item[data-view="maintenance"]');
  
  reportsNavItem.style.display = 'flex';
  expensesNavItem.style.display = 'flex';
  maintNavItem.style.display = 'flex';
  
  if (role === 'fleet_manager') {
    document.querySelectorAll('.manager-only').forEach(el => el.style.display = 'inline-flex');
    document.querySelectorAll('.manager-safety-only').forEach(el => el.style.display = 'inline-flex');
    document.querySelectorAll('.manager-driver-only').forEach(el => el.style.display = 'inline-flex');
    document.querySelectorAll('.manager-driver-finance-only').forEach(el => el.style.display = 'inline-flex');
    
  } else if (role === 'driver') {
    document.querySelectorAll('.manager-driver-only').forEach(el => el.style.display = 'inline-flex');
    document.querySelectorAll('.manager-driver-finance-only').forEach(el => el.style.display = 'inline-flex');
    reportsNavItem.style.display = 'none'; // No access to ROI / Financial Reports
    
  } else if (role === 'safety_officer') {
    document.querySelectorAll('.manager-safety-only').forEach(el => el.style.display = 'inline-flex');
    expensesNavItem.style.display = 'none'; // No access to expense entry
    
  } else if (role === 'financial_analyst') {
    document.querySelectorAll('.manager-driver-finance-only').forEach(el => el.style.display = 'inline-flex');
  }
}

function formatRole(role) {
  return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Handle Login Form Submit
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  
  // Simple Mock Login Logic based on seed data
  let userDetails = null;
  if (email === 'fleet@transitops.com' && pass === 'password123') {
    userDetails = { email, full_name: 'Alice Manager', role: 'fleet_manager' };
  } else if (email === 'driver@transitops.com' && pass === 'password123') {
    userDetails = { email, full_name: 'Bob Driver', role: 'driver' };
  } else if (email === 'safety@transitops.com' && pass === 'password123') {
    userDetails = { email, full_name: 'Eve Officer', role: 'safety_officer' };
  } else if (email === 'finance@transitops.com' && pass === 'password123') {
    userDetails = { email, full_name: 'Trent Analyst', role: 'financial_analyst' };
  }
  
  if (userDetails) {
    sessionStorage.setItem('transitops_user', JSON.stringify(userDetails));
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    showToast(`Logged in as ${userDetails.full_name}`, 'success');
    checkAuth();
  } else {
    showToast('Invalid email or password combination.', 'error');
  }
});

// Logout Button
document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('transitops_user');
  showToast('Logged out successfully.', 'info');
  checkAuth();
});

// ==========================================
// 3. UI VIEW CONTROLLER & ROUTING
// ==========================================

function setupEventListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      const view = item.getAttribute('data-view');
      switchView(view);
    });
  });
  
  // Theme Toggler
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Close Modals
  document.querySelectorAll('.btn-close, .btn-close-modal, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('btn-close') || el.classList.contains('btn-close-modal')) {
        closeAllModals();
      }
    });
  });
}

function switchView(view) {
  state.activeView = view;
  document.querySelectorAll('.view-content').forEach(v => v.classList.remove('active'));
  
  const activeSection = document.getElementById(`${view}-view`);
  if (activeSection) {
    activeSection.classList.add('active');
  }
  
  // Set titles
  const titleMap = {
    dashboard: { t: 'Dashboard Overview', s: 'Real-time transit operations metrics' },
    vehicles: { t: 'Vehicle Registry', s: 'Manage fleet assets, configurations, and lifecycles' },
    drivers: { t: 'Driver Rosters', s: 'Manage drivers, license expiry dates, and safety scores' },
    trips: { t: 'Trip Console', s: 'Create and dispatch trips, track cargo weights and status' },
    maintenance: { t: 'Maintenance Logbook', s: 'Schedule vehicle servicing and track shop status' },
    expenses: { t: 'Expenses & Fuel Refills', s: 'Record tolls, insurance, and fuel consumption logs' },
    reports: { t: 'Reports & Business Intelligence', s: 'Performance summaries, fuel efficiency, and ROI analysis' }
  };
  
  document.getElementById('view-title').textContent = titleMap[view]?.t || 'TransitOps';
  document.getElementById('view-subtitle').textContent = titleMap[view]?.s || '';
  
  // Render specific views
  if (view === 'dashboard') renderDashboard();
  else if (view === 'vehicles') renderVehicles();
  else if (view === 'drivers') renderDrivers();
  else if (view === 'trips') renderTrips();
  else if (view === 'maintenance') renderMaintenance();
  else if (view === 'expenses') renderExpenses();
  else if (view === 'reports') renderReports();
}

// Modals
function openModal(id) {
  closeAllModals();
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// Theme
function initTheme() {
  const t = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Toast
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// 4. RENDERING & OPERATIONS
// ==========================================

// --- DASHBOARD ---
function renderDashboard() {
  // Load and apply dashboard filters
  const regionSelect = document.getElementById('dash-filter-region');
  
  // Populate region filter
  const regions = [...new Set(state.vehicles.map(v => v.region).filter(Boolean))];
  const selectedRegion = regionSelect.value;
  regionSelect.innerHTML = '<option value="">All Regions</option>';
  regions.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = r;
    if (r === selectedRegion) opt.selected = true;
    regionSelect.appendChild(opt);
  });
  
  const typeFilter = document.getElementById('dash-filter-type').value;
  const regionFilter = regionSelect.value;
  
  // Filter vehicles
  let filteredVehicles = state.vehicles;
  if (typeFilter) filteredVehicles = filteredVehicles.filter(v => v.type === typeFilter);
  if (regionFilter) filteredVehicles = filteredVehicles.filter(v => v.region === regionFilter);
  
  const filteredVehicleIds = new Set(filteredVehicles.map(v => v.id));
  
  // Calculate KPI metrics
  const activeVehicles = filteredVehicles.filter(v => v.status === 'on_trip').length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'available').length;
  const inShop = filteredVehicles.filter(v => v.status === 'in_shop').length;
  
  // Trips filtered by vehicle subset
  const relatedTrips = state.trips.filter(t => filteredVehicleIds.has(t.vehicle_id));
  const activeTrips = relatedTrips.filter(t => t.status === 'dispatched').length;
  const pendingTrips = relatedTrips.filter(t => t.status === 'draft').length;
  
  // Drivers On Duty (drivers assigned to active vehicles or available)
  const driversOnDuty = state.drivers.filter(d => d.status === 'available' || d.status === 'on_trip').length;
  
  // Utilization
  const nonRetiredVehicles = filteredVehicles.filter(v => v.status !== 'retired').length;
  const utilization = nonRetiredVehicles > 0 ? Math.round((activeVehicles / nonRetiredVehicles) * 100) : 0;
  
  // Set text
  document.getElementById('kpi-active-vehicles').textContent = activeVehicles;
  document.getElementById('kpi-available-vehicles').textContent = availableVehicles;
  document.getElementById('kpi-in-maintenance').textContent = inShop;
  document.getElementById('kpi-active-trips').textContent = activeTrips;
  document.getElementById('kpi-pending-trips').textContent = pendingTrips;
  document.getElementById('kpi-drivers-on-duty').textContent = driversOnDuty;
  document.getElementById('kpi-fleet-utilization').textContent = `${utilization}%`;
  
  // 1. Compliance Alerts
  const alertContainer = document.getElementById('dashboard-alerts');
  alertContainer.innerHTML = '';
  
  const alerts = [];
  const today = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  
  // Expiring licenses
  state.drivers.forEach(d => {
    const expiry = new Date(d.license_expiry_date);
    const diff = expiry - today;
    if (diff < 0) {
      alerts.push({ text: `🚨 Driver <strong>${d.name}</strong>'s license is EXPIRED! (${d.license_expiry_date})`, urgent: true });
    } else if (diff < thirtyDays) {
      alerts.push({ text: `⚠️ Driver <strong>${d.name}</strong>'s license expires soon: ${d.license_expiry_date}`, urgent: false });
    }
  });
  
  // High maintenance spend warning
  state.vehicles.forEach(v => {
    const closedLogs = state.maintenance.filter(m => m.vehicle_id === v.id && m.status === 'closed');
    const totalSpend = closedLogs.reduce((acc, curr) => acc + Number(curr.cost), 0);
    if (totalSpend > v.acquisition_cost * 0.3) {
      alerts.push({ text: `⚠️ Vehicle <strong>${v.name_model}</strong>'s cumulative maintenance cost (₹${totalSpend.toLocaleString()}) exceeds 30% of its acquisition value.`, urgent: false });
    }
  });
  
  if (alerts.length > 0) {
    alerts.forEach(a => {
      const p = document.createElement('p');
      p.style.padding = '8px 12px';
      p.style.borderRadius = '6px';
      p.style.margin = '0 0 8px 0';
      p.style.fontSize = '13px';
      p.style.backgroundColor = a.urgent ? 'var(--danger-light)' : 'var(--warning-light)';
      p.style.color = a.urgent ? 'var(--danger)' : 'var(--warning)';
      p.innerHTML = a.text;
      alertContainer.appendChild(p);
    });
  } else {
    alertContainer.innerHTML = '<p style="color:var(--text-secondary); font-style:italic;">No critical compliance alerts.</p>';
  }
  
  // 2. Recent Activities logs
  const activityContainer = document.getElementById('dashboard-activity');
  activityContainer.innerHTML = '';
  
  // Sort trips by creation or status updates
  const sortedTrips = [...state.trips].sort((a,b) => b.id - a.id).slice(0, 5);
  
  if (sortedTrips.length > 0) {
    sortedTrips.forEach(t => {
      const v = state.vehicles.find(veh => veh.id === t.vehicle_id);
      const d = state.drivers.find(drv => drv.id === t.driver_id);
      const div = document.createElement('div');
      div.style.padding = '8px 12px';
      div.style.borderRadius = '6px';
      div.style.marginBottom = '8px';
      div.style.border = '1px solid var(--border-color)';
      div.style.fontSize = '13px';
      div.innerHTML = `Trip ID <strong>#${t.id}</strong> (${t.source} ➔ ${t.destination}): status shifted to <span class="badge badge-${t.status}">${t.status}</span>. Assg: ${d ? d.name : 'Unknown'} in ${v ? v.name_model : 'Unknown'}.`;
      activityContainer.appendChild(div);
    });
  } else {
    activityContainer.innerHTML = '<p style="color:var(--text-secondary); font-style:italic;">No recent activity logged.</p>';
  }
}

// Reset Dashboard Filters
document.getElementById('btn-reset-dash-filters').addEventListener('click', () => {
  document.getElementById('dash-filter-type').value = '';
  document.getElementById('dash-filter-region').value = '';
  renderDashboard();
});

// Watch dashboard filter updates
document.getElementById('dash-filter-type').addEventListener('change', renderDashboard);
document.getElementById('dash-filter-region').addEventListener('change', renderDashboard);

// --- VEHICLES ---
function renderVehicles() {
  const query = document.getElementById('vehicle-search').value.toLowerCase();
  const typeFilter = document.getElementById('vehicle-filter-type').value;
  const statusFilter = document.getElementById('vehicle-filter-status').value;
  
  const tbody = document.getElementById('vehicles-table-body');
  tbody.innerHTML = '';
  
  const filtered = state.vehicles.filter(v => {
    const matchesQuery = v.registration_number.toLowerCase().includes(query) || v.name_model.toLowerCase().includes(query);
    const matchesType = !typeFilter || v.type === typeFilter;
    const matchesStatus = !statusFilter || v.status === statusFilter;
    return matchesQuery && matchesType && matchesStatus;
  });
  
  filtered.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${v.registration_number}</strong></td>
      <td>${v.name_model}</td>
      <td style="text-transform: capitalize;">${v.type}</td>
      <td>${Number(v.max_load_capacity).toLocaleString()} kg</td>
      <td>${Number(v.odometer).toLocaleString()} km</td>
      <td>₹${Number(v.acquisition_cost).toLocaleString()}</td>
      <td>${v.region || '—'}</td>
      <td><span class="badge badge-${v.status}">${v.status.replace('_', ' ')}</span></td>
      <td class="manager-only">
        <button class="btn btn-secondary btn-sm" onclick="editVehicle(${v.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteVehicle(${v.id})" style="margin-left: 4px;">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Re-apply access controls on table actions column
  applyRoleBasedUI(state.user.role);
}

// Open modal for vehicle
document.getElementById('btn-add-vehicle').addEventListener('click', () => {
  document.getElementById('vehicle-form').reset();
  document.getElementById('vehicle-form-id').value = '';
  document.getElementById('modal-vehicle-title').textContent = 'Register New Vehicle';
  document.getElementById('vehicle-reg').disabled = false;
  openModal('modal-vehicle');
});

// Submit vehicle form
document.getElementById('vehicle-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const idVal = document.getElementById('vehicle-form-id').value;
  const regNum = document.getElementById('vehicle-reg').value.trim().toUpperCase();
  const model = document.getElementById('vehicle-model').value.trim();
  const type = document.getElementById('vehicle-type').value;
  const capacity = Number(document.getElementById('vehicle-capacity').value);
  const odometer = Number(document.getElementById('vehicle-odometer').value || 0);
  const cost = Number(document.getElementById('vehicle-cost').value);
  const region = document.getElementById('vehicle-region').value.trim();
  const status = document.getElementById('vehicle-status').value;
  
  // Check registration number uniqueness (rule 1)
  const duplicate = state.vehicles.find(v => v.registration_number === regNum && v.id !== Number(idVal));
  if (duplicate) {
    showToast(`Vehicle with Registration Number "${regNum}" already exists!`, 'error');
    return;
  }
  
  if (idVal) {
    // Edit
    const idx = state.vehicles.findIndex(v => v.id === Number(idVal));
    if (idx !== -1) {
      state.vehicles[idx] = { ...state.vehicles[idx], name_model: model, type, max_load_capacity: capacity, odometer, acquisition_cost: cost, region, status };
      showToast('Vehicle configuration updated.', 'success');
    }
  } else {
    // Create new
    const newId = state.vehicles.length > 0 ? Math.max(...state.vehicles.map(v => v.id)) + 1 : 1;
    state.vehicles.push({ id: newId, registration_number: regNum, name_model: model, type, max_load_capacity: capacity, odometer, acquisition_cost: cost, status, region });
    showToast('New vehicle registered successfully.', 'success');
  }
  
  saveStateToLocal();
  closeAllModals();
  renderVehicles();
});

window.editVehicle = function(id) {
  const v = state.vehicles.find(veh => veh.id === id);
  if (!v) return;
  
  document.getElementById('vehicle-form-id').value = v.id;
  document.getElementById('vehicle-reg').value = v.registration_number;
  document.getElementById('vehicle-reg').disabled = true; // unique column key
  document.getElementById('vehicle-model').value = v.name_model;
  document.getElementById('vehicle-type').value = v.type;
  document.getElementById('vehicle-capacity').value = v.max_load_capacity;
  document.getElementById('vehicle-odometer').value = v.odometer;
  document.getElementById('vehicle-cost').value = v.acquisition_cost;
  document.getElementById('vehicle-region').value = v.region || '';
  document.getElementById('vehicle-status').value = v.status;
  
  document.getElementById('modal-vehicle-title').textContent = 'Modify Vehicle details';
  openModal('modal-vehicle');
};

window.deleteVehicle = function(id) {
  // Confirm deletion
  if (confirm('Are you sure you want to delete this vehicle? This will block operations associated with it.')) {
    const idx = state.vehicles.findIndex(v => v.id === id);
    if (idx !== -1) {
      state.vehicles.splice(idx, 1);
      saveStateToLocal();
      renderVehicles();
      showToast('Vehicle deleted successfully.', 'info');
    }
  }
};

// Search & filters event listeners
document.getElementById('vehicle-search').addEventListener('input', renderVehicles);
document.getElementById('vehicle-filter-type').addEventListener('change', renderVehicles);
document.getElementById('vehicle-filter-status').addEventListener('change', renderVehicles);

// --- DRIVERS ---
function renderDrivers() {
  const query = document.getElementById('driver-search').value.toLowerCase();
  const statusFilter = document.getElementById('driver-filter-status').value;
  
  const tbody = document.getElementById('drivers-table-body');
  tbody.innerHTML = '';
  
  const filtered = state.drivers.filter(d => {
    const matchesQuery = d.name.toLowerCase().includes(query) || d.license_number.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || d.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
  
  filtered.forEach(d => {
    const isExpired = new Date(d.license_expiry_date) < new Date();
    const expiryStyle = isExpired ? 'color: var(--danger); font-weight:600' : '';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${d.name}</strong></td>
      <td>${d.license_number}</td>
      <td>${d.license_category}</td>
      <td style="${expiryStyle}">${d.license_expiry_date} ${isExpired ? '(EXPIRED)' : ''}</td>
      <td>${d.contact_number}</td>
      <td>
        <span style="font-weight: 600; color: ${d.safety_score >= 85 ? 'var(--success)' : d.safety_score >= 70 ? 'var(--warning)' : 'var(--danger)'}">
          ${d.safety_score}%
        </span>
      </td>
      <td><span class="badge badge-${d.status}">${d.status}</span></td>
      <td class="manager-safety-only">
        <button class="btn btn-secondary btn-sm" onclick="editDriver(${d.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteDriver(${d.id})" style="margin-left: 4px;">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  applyRoleBasedUI(state.user.role);
}

// Open modal for driver
document.getElementById('btn-add-driver').addEventListener('click', () => {
  document.getElementById('driver-form').reset();
  document.getElementById('driver-form-id').value = '';
  document.getElementById('modal-driver-title').textContent = 'Register Driver Profile';
  openModal('modal-driver');
});

// Submit driver form
document.getElementById('driver-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const idVal = document.getElementById('driver-form-id').value;
  const name = document.getElementById('driver-name').value.trim();
  const license = document.getElementById('driver-license').value.trim().toUpperCase();
  const category = document.getElementById('driver-category').value;
  const expiry = document.getElementById('driver-expiry').value;
  const contact = document.getElementById('driver-contact').value.trim();
  const score = Number(document.getElementById('driver-score').value || 100);
  const status = document.getElementById('driver-status').value;
  
  // Unique license (rule 1 equivalent)
  const duplicate = state.drivers.find(d => d.license_number === license && d.id !== Number(idVal));
  if (duplicate) {
    showToast(`Driver with License Number "${license}" already registered!`, 'error');
    return;
  }
  
  if (idVal) {
    // Edit
    const idx = state.drivers.findIndex(d => d.id === Number(idVal));
    if (idx !== -1) {
      state.drivers[idx] = { ...state.drivers[idx], name, license_number: license, license_category: category, license_expiry_date: expiry, contact_number: contact, safety_score: score, status };
      showToast('Driver profile updated.', 'success');
    }
  } else {
    // Create new
    const newId = state.drivers.length > 0 ? Math.max(...state.drivers.map(d => d.id)) + 1 : 1;
    state.drivers.push({ id: newId, name, license_number: license, license_category: category, license_expiry_date: expiry, contact_number: contact, safety_score: score, status });
    showToast('New driver registered.', 'success');
  }
  
  saveStateToLocal();
  closeAllModals();
  renderDrivers();
});

window.editDriver = function(id) {
  const d = state.drivers.find(drv => drv.id === id);
  if (!d) return;
  
  document.getElementById('driver-form-id').value = d.id;
  document.getElementById('driver-name').value = d.name;
  document.getElementById('driver-license').value = d.license_number;
  document.getElementById('driver-category').value = d.license_category;
  document.getElementById('driver-expiry').value = d.license_expiry_date;
  document.getElementById('driver-contact').value = d.contact_number;
  document.getElementById('driver-score').value = d.safety_score;
  document.getElementById('driver-status').value = d.status;
  
  document.getElementById('modal-driver-title').textContent = 'Modify Driver Profile';
  openModal('modal-driver');
};

window.deleteDriver = function(id) {
  if (confirm('Are you sure you want to remove this driver profile?')) {
    const idx = state.drivers.findIndex(d => d.id === id);
    if (idx !== -1) {
      state.drivers.splice(idx, 1);
      saveStateToLocal();
      renderDrivers();
      showToast('Driver profile deleted.', 'info');
    }
  }
};

document.getElementById('driver-search').addEventListener('input', renderDrivers);
document.getElementById('driver-filter-status').addEventListener('change', renderDrivers);

// --- TRIPS ---
function renderTrips() {
  const query = document.getElementById('trip-search').value.toLowerCase();
  const statusFilter = document.getElementById('trip-filter-status').value;
  
  const tbody = document.getElementById('trips-table-body');
  tbody.innerHTML = '';
  
  const filtered = state.trips.filter(t => {
    const matchesQuery = t.source.toLowerCase().includes(query) || t.destination.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
  
  filtered.forEach(t => {
    const v = state.vehicles.find(veh => veh.id === t.vehicle_id);
    const d = state.drivers.find(drv => drv.id === t.driver_id);
    
    // Actions based on lifecycle state
    let actionButtons = '';
    if (t.status === 'draft') {
      actionButtons = `
        <button class="btn btn-primary btn-sm manager-driver-only" onclick="dispatchTrip(${t.id})">Dispatch</button>
        <button class="btn btn-secondary btn-sm manager-driver-only" onclick="cancelTrip(${t.id})" style="margin-left:4px;">Cancel</button>
      `;
    } else if (t.status === 'dispatched') {
      actionButtons = `
        <button class="btn btn-success btn-sm manager-driver-only" onclick="openCompleteTripModal(${t.id})" style="color:white">Complete</button>
        <button class="btn btn-danger btn-sm manager-driver-only" onclick="cancelTrip(${t.id})" style="margin-left:4px;">Cancel</button>
      `;
    } else {
      actionButtons = '<span style="color:var(--text-muted); font-style:italic;">None</span>';
    }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#TR-${t.id}</strong></td>
      <td>
        <div style="font-weight:600;">${t.source} ➔ ${t.destination}</div>
        <span style="font-size:11px; color:var(--text-secondary);">${t.dispatched_at || 'Not started'}</span>
      </td>
      <td>
        <div>${v ? v.name_model : 'Unknown'}</div>
        <span style="font-size:11px; color:var(--text-secondary);">${v ? v.registration_number : '—'}</span>
      </td>
      <td>${d ? d.name : 'Unknown'}</td>
      <td>${Number(t.cargo_weight).toLocaleString()} kg</td>
      <td>
        <div>Planned: ${Number(t.planned_distance).toLocaleString()} km</div>
        <div style="font-size:11px; color:var(--text-secondary)">Actual: ${t.actual_distance ? Number(t.actual_distance).toLocaleString() + ' km' : '—'}</div>
      </td>
      <td><span class="badge badge-${t.status}">${t.status}</span></td>
      <td>${actionButtons}</td>
    `;
    tbody.appendChild(tr);
  });
  
  applyRoleBasedUI(state.user.role);
}

// Open booking modal
document.getElementById('btn-create-trip').addEventListener('click', () => {
  document.getElementById('trip-form').reset();
  
  // Populate dropdowns matching business rules
  const vehicleSelect = document.getElementById('trip-vehicle');
  const driverSelect = document.getElementById('trip-driver');
  
  // Rule 2 & 4: Only show available vehicles (not on trip, in shop, or retired)
  vehicleSelect.innerHTML = '<option value="">-- Choose Vehicle --</option>';
  state.vehicles.filter(v => v.status === 'available').forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.name_model} (${v.registration_number}) - Cap: ${v.max_load_capacity}kg`;
    vehicleSelect.appendChild(opt);
  });
  
  // Rule 3 & 4: Only show available drivers (not suspended, off duty, on trip, and license not expired)
  driverSelect.innerHTML = '<option value="">-- Choose Driver --</option>';
  const todayStr = new Date().toISOString().split('T')[0];
  state.drivers.filter(d => d.status === 'available' && d.license_expiry_date >= todayStr).forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `${d.name} (${d.license_category}) - Score: ${d.safety_score}%`;
    driverSelect.appendChild(opt);
  });
  
  document.getElementById('trip-cargo-warning').style.display = 'none';
  openModal('modal-trip');
});

// Real-time capacity warning (rule 5)
document.getElementById('trip-vehicle').addEventListener('change', checkCargoCapacity);
document.getElementById('trip-cargo').addEventListener('input', checkCargoCapacity);

function checkCargoCapacity() {
  const vehId = document.getElementById('trip-vehicle').value;
  const cargoWeight = Number(document.getElementById('trip-cargo').value || 0);
  const warningSpan = document.getElementById('trip-cargo-warning');
  
  if (vehId && cargoWeight) {
    const veh = state.vehicles.find(v => v.id === Number(vehId));
    if (veh && cargoWeight > veh.max_load_capacity) {
      warningSpan.style.display = 'block';
      warningSpan.textContent = `Weight exceeds vehicle load limit of ${veh.max_load_capacity} kg!`;
      return false;
    }
  }
  warningSpan.style.display = 'none';
  return true;
}

// Create trip submit
document.getElementById('trip-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!checkCargoCapacity()) {
    showToast('Cannot book trip: Cargo weight exceeds load capacity limit.', 'error');
    return;
  }
  
  const src = document.getElementById('trip-source').value.trim();
  const dest = document.getElementById('trip-destination').value.trim();
  const vehId = Number(document.getElementById('trip-vehicle').value);
  const drvId = Number(document.getElementById('trip-driver').value);
  const cargo = Number(document.getElementById('trip-cargo').value);
  const distance = Number(document.getElementById('trip-distance').value);
  
  const newId = state.trips.length > 0 ? Math.max(...state.trips.map(t => t.id)) + 1 : 1;
  
  const newTrip = {
    id: newId,
    source: src,
    destination: dest,
    vehicle_id: vehId,
    driver_id: drvId,
    cargo_weight: cargo,
    planned_distance: distance,
    actual_distance: null,
    fuel_consumed: null,
    final_odometer: null,
    status: 'draft',
    dispatched_at: null,
    completed_at: null
  };
  
  state.trips.push(newTrip);
  saveStateToLocal();
  closeAllModals();
  renderTrips();
  showToast(`Trip #TR-${newId} created in Draft status. Ready to dispatch.`, 'success');
});

// Dispatch Trip (rule 6)
window.dispatchTrip = function(id) {
  const trip = state.trips.find(t => t.id === id);
  if (!trip) return;
  
  const v = state.vehicles.find(veh => veh.id === trip.vehicle_id);
  const d = state.drivers.find(drv => drv.id === trip.driver_id);
  
  if (v.status !== 'available' || d.status !== 'available') {
    showToast('Cannot dispatch: Vehicle or Driver is no longer available.', 'error');
    return;
  }
  
  // Transition state
  trip.status = 'dispatched';
  trip.dispatched_at = new Date().toLocaleString();
  
  // Automatically updates statuses to on_trip
  v.status = 'on_trip';
  d.status = 'on_trip';
  
  saveStateToLocal();
  renderTrips();
  showToast(`Trip #TR-${id} dispatched! Vehicle ${v.registration_number} and Driver ${d.name} are on route.`, 'success');
};

// Open complete trip form modal
window.openCompleteTripModal = function(id) {
  const trip = state.trips.find(t => t.id === id);
  if (!trip) return;
  
  const v = state.vehicles.find(veh => veh.id === trip.vehicle_id);
  if (!v) return;
  
  document.getElementById('complete-trip-id').value = trip.id;
  document.getElementById('complete-vehicle-id').value = v.id;
  document.getElementById('complete-actual-dist').value = trip.planned_distance;
  document.getElementById('complete-fuel-consumed').value = '';
  document.getElementById('complete-fuel-cost').value = '';
  
  // Set placeholder / starting suggestion for odometer
  const expectedOdo = Number(v.odometer) + Number(trip.planned_distance);
  document.getElementById('complete-final-odo').value = expectedOdo;
  document.getElementById('complete-final-odo').setAttribute('placeholder', `Must be > ${v.odometer}`);
  
  document.getElementById('complete-odo-warning').style.display = 'none';
  openModal('modal-complete-trip');
};

// Complete trip form submit (rule 7)
document.getElementById('complete-trip-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const tripId = Number(document.getElementById('complete-trip-id').value);
  const vehId = Number(document.getElementById('complete-vehicle-id').value);
  const actualDist = Number(document.getElementById('complete-actual-dist').value);
  const fuelConsumed = Number(document.getElementById('complete-fuel-consumed').value);
  const fuelCost = Number(document.getElementById('complete-fuel-cost').value);
  const finalOdo = Number(document.getElementById('complete-final-odo').value);
  
  const trip = state.trips.find(t => t.id === tripId);
  const v = state.vehicles.find(veh => veh.id === vehId);
  const d = state.drivers.find(drv => drv.id === trip.driver_id);
  
  if (finalOdo <= v.odometer) {
    const warning = document.getElementById('complete-odo-warning');
    warning.style.display = 'block';
    warning.textContent = `Odometer must exceed vehicle starting odometer: ${v.odometer} km.`;
    return;
  }
  
  // Update trip lifecycle
  trip.status = 'completed';
  trip.completed_at = new Date().toLocaleString();
  trip.actual_distance = actualDist;
  trip.fuel_consumed = fuelConsumed;
  trip.final_odometer = finalOdo;
  
  // Restore statuses back to Available & update odometer
  v.status = 'available';
  v.odometer = finalOdo;
  d.status = 'available';
  
  // Auto-refill fuel log
  const newFuelId = state.fuel.length > 0 ? Math.max(...state.fuel.map(f => f.id)) + 1 : 1;
  const todayStr = new Date().toISOString().split('T')[0];
  state.fuel.push({
    id: newFuelId,
    vehicle_id: v.id,
    trip_id: trip.id,
    liters: fuelConsumed,
    cost: fuelCost,
    date: todayStr
  });
  
  // Auto-record expense
  const newExpId = state.expenses.length > 0 ? Math.max(...state.expenses.map(ex => ex.id)) + 1 : 1;
  state.expenses.push({
    id: newExpId,
    vehicle_id: v.id,
    trip_id: trip.id,
    category: 'fuel',
    description: `Fuel refill for trip TR-${trip.id} to ${trip.destination}`,
    amount: fuelCost,
    date: todayStr
  });
  
  saveStateToLocal();
  closeAllModals();
  renderTrips();
  showToast(`Trip #TR-${tripId} marked Completed! Vehicle & Driver restored to Available. Fuel and Expense logged.`, 'success');
});

// Cancel active trip (rule 8)
window.cancelTrip = function(id) {
  if (confirm(`Are you sure you want to cancel Trip #TR-${id}?`)) {
    const trip = state.trips.find(t => t.id === id);
    if (!trip) return;
    
    const v = state.vehicles.find(veh => veh.id === trip.vehicle_id);
    const d = state.drivers.find(drv => drv.id === trip.driver_id);
    
    trip.status = 'cancelled';
    trip.completed_at = new Date().toLocaleString();
    
    // Restores statuses
    if (v) v.status = 'available';
    if (d) d.status = 'available';
    
    saveStateToLocal();
    renderTrips();
    showToast(`Trip #TR-${id} cancelled. Vehicle & Driver restored to Available.`, 'info');
  }
};

document.getElementById('trip-search').addEventListener('input', renderTrips);
document.getElementById('trip-filter-status').addEventListener('change', renderTrips);

// --- MAINTENANCE ---
function renderMaintenance() {
  const query = document.getElementById('maintenance-search').value.toLowerCase();
  const statusFilter = document.getElementById('maintenance-filter-status').value;
  
  const tbody = document.getElementById('maintenance-table-body');
  tbody.innerHTML = '';
  
  const filtered = state.maintenance.filter(m => {
    const v = state.vehicles.find(veh => veh.id === m.vehicle_id);
    const matchesQuery = (v && v.name_model.toLowerCase().includes(query)) || m.description.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || m.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
  
  filtered.forEach(m => {
    const v = state.vehicles.find(veh => veh.id === m.vehicle_id);
    
    let actionButtons = '';
    if (m.status === 'active') {
      actionButtons = `<button class="btn btn-primary btn-sm manager-only" onclick="openCloseMaintenanceModal(${m.id})">Close Ticket</button>`;
    } else {
      actionButtons = '<span style="color:var(--text-muted); font-style:italic;">Resolved</span>';
    }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#MT-${m.id}</strong></td>
      <td>
        <div style="font-weight:600;">${v ? v.name_model : 'Unknown'}</div>
        <span style="font-size:11px; color:var(--text-secondary);">${v ? v.registration_number : '—'}</span>
      </td>
      <td style="text-transform: capitalize;">${m.type.replace('_', ' ')}</td>
      <td>${m.description}</td>
      <td>₹${Number(m.cost).toLocaleString()}</td>
      <td>${m.started_at.split(' ')[0]}</td>
      <td>${m.closed_at ? m.closed_at.split(' ')[0] : '—'}</td>
      <td><span class="badge ${m.status === 'active' ? 'badge-in_shop' : 'badge-completed'}">${m.status === 'active' ? 'In Shop' : 'Closed'}</span></td>
      <td class="manager-only">${actionButtons}</td>
    `;
    tbody.appendChild(tr);
  });
  
  applyRoleBasedUI(state.user.role);
}

// Log Maintenance Button
document.getElementById('btn-log-maintenance').addEventListener('click', () => {
  document.getElementById('maintenance-form').reset();
  
  // Populate vehicle dropdown (can only log maintenance for non-retired, non-shop vehicles)
  const select = document.getElementById('maint-vehicle');
  select.innerHTML = '<option value="">-- Choose Vehicle --</option>';
  state.vehicles.filter(v => v.status !== 'retired' && v.status !== 'in_shop').forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.name_model} (${v.registration_number})`;
    select.appendChild(opt);
  });
  
  openModal('modal-maintenance');
});

// Submit maintenance (rule 9)
document.getElementById('maintenance-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const vehId = Number(document.getElementById('maint-vehicle').value);
  const type = document.getElementById('maint-type').value;
  const cost = Number(document.getElementById('maint-est-cost').value);
  const desc = document.getElementById('maint-desc').value.trim();
  
  const v = state.vehicles.find(veh => veh.id === vehId);
  if (!v) return;
  
  const newId = state.maintenance.length > 0 ? Math.max(...state.maintenance.map(m => m.id)) + 1 : 1;
  const todayStr = new Date().toISOString().split('T')[0];
  
  state.maintenance.push({
    id: newId,
    vehicle_id: vehId,
    description: desc,
    type: type,
    cost: cost,
    status: 'active',
    started_at: todayStr,
    closed_at: null
  });
  
  // Changes vehicle status to in_shop
  v.status = 'in_shop';
  
  saveStateToLocal();
  closeAllModals();
  renderMaintenance();
  showToast(`Maintenance logged. Vehicle ${v.registration_number} marked In Shop.`, 'success');
});

// Close Maintenance ticket modal
window.openCloseMaintenanceModal = function(id) {
  const m = state.maintenance.find(l => l.id === id);
  if (!m) return;
  
  document.getElementById('close-maint-id').value = m.id;
  document.getElementById('close-maint-vehicle-id').value = m.vehicle_id;
  document.getElementById('close-maint-cost').value = m.cost;
  
  openModal('modal-close-maintenance');
};

// Close Maintenance ticket submit (rule 10)
document.getElementById('close-maintenance-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const maintId = Number(document.getElementById('close-maint-id').value);
  const vehId = Number(document.getElementById('close-maint-vehicle-id').value);
  const actualCost = Number(document.getElementById('close-maint-cost').value);
  
  const m = state.maintenance.find(l => l.id === maintId);
  const v = state.vehicles.find(veh => veh.id === vehId);
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Transition state
  m.status = 'closed';
  m.closed_at = todayStr;
  m.cost = actualCost;
  
  // Restore vehicle status (unless retired)
  if (v.status !== 'retired') {
    v.status = 'available';
  }
  
  // Automatically record operation expense
  const newExpId = state.expenses.length > 0 ? Math.max(...state.expenses.map(ex => ex.id)) + 1 : 1;
  state.expenses.push({
    id: newExpId,
    vehicle_id: v.id,
    trip_id: null,
    category: 'maintenance',
    description: `Service resolved (${m.type}): ${m.description}`,
    amount: actualCost,
    date: todayStr
  });
  
  saveStateToLocal();
  closeAllModals();
  renderMaintenance();
  showToast(`Maintenance resolved. Vehicle ${v.registration_number} status restored to Available. Expense filed.`, 'success');
});

document.getElementById('maintenance-search').addEventListener('input', renderMaintenance);
document.getElementById('maintenance-filter-status').addEventListener('change', renderMaintenance);

// --- EXPENSES & FUEL ---
function renderExpenses() {
  const searchExpense = document.getElementById('expense-search').value.toLowerCase();
  const filterCat = document.getElementById('expense-filter-category').value;
  const searchFuel = document.getElementById('fuel-search').value.toLowerCase();
  
  // 1. Expenses Table
  const expBody = document.getElementById('expenses-table-body');
  expBody.innerHTML = '';
  const filteredExp = state.expenses.filter(ex => {
    const v = state.vehicles.find(veh => veh.id === ex.vehicle_id);
    const matchesSearch = ex.description.toLowerCase().includes(searchExpense) || (v && v.name_model.toLowerCase().includes(searchExpense));
    const matchesCat = !filterCat || ex.category === filterCat;
    return matchesSearch && matchesCat;
  });
  
  filteredExp.forEach(ex => {
    const v = state.vehicles.find(veh => veh.id === ex.vehicle_id);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ex.date}</td>
      <td>
        <div style="font-weight:600;">${v ? v.name_model : 'Unknown'}</div>
        <span style="font-size:11px; color:var(--text-secondary);">${v ? v.registration_number : '—'}</span>
      </td>
      <td><span class="badge" style="background-color:var(--border-color); color:var(--text-primary); text-transform:capitalize;">${ex.category}</span></td>
      <td>${ex.description} ${ex.trip_id ? `<span style="font-size:11px; color:var(--primary)">[Trip #${ex.trip_id}]</span>` : ''}</td>
      <td style="font-weight:600;">₹${Number(ex.amount).toLocaleString()}</td>
    `;
    expBody.appendChild(tr);
  });
  
  // 2. Fuel Logs Table
  const fuelBody = document.getElementById('fuel-table-body');
  fuelBody.innerHTML = '';
  const filteredFuel = state.fuel.filter(f => {
    const v = state.vehicles.find(veh => veh.id === f.vehicle_id);
    return !searchFuel || (v && v.name_model.toLowerCase().includes(searchFuel)) || (v && v.registration_number.toLowerCase().includes(searchFuel));
  });
  
  filteredFuel.forEach(f => {
    const v = state.vehicles.find(veh => veh.id === f.vehicle_id);
    const trip = state.trips.find(t => t.id === f.trip_id);
    
    // Calculate efficiency if associated with a trip
    let efficiency = '—';
    if (trip && trip.actual_distance && f.liters) {
      efficiency = `${(trip.actual_distance / f.liters).toFixed(2)} km/L`;
    }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.date}</td>
      <td>
        <div style="font-weight:600;">${v ? v.name_model : 'Unknown'}</div>
        <span style="font-size:11px; color:var(--text-secondary);">${v ? v.registration_number : '—'}</span>
      </td>
      <td>${Number(f.liters).toFixed(1)} L</td>
      <td style="font-weight:600;">₹${Number(f.cost).toLocaleString()}</td>
      <td>${efficiency} ${trip ? `<span style="font-size:11px; color:var(--text-secondary); display:block;">Trip #${trip.id}: ${trip.source}➔${trip.destination} (${trip.actual_distance}km)</span>` : ''}</td>
    `;
    fuelBody.appendChild(tr);
  });
}

// Sub-Tab Toggles
document.getElementById('tab-expenses').addEventListener('click', () => {
  document.getElementById('tab-expenses').classList.add('btn-primary');
  document.getElementById('tab-fuel').classList.remove('btn-primary');
  document.getElementById('sub-expenses-view').style.display = 'block';
  document.getElementById('sub-fuel-view').style.display = 'none';
  document.getElementById('btn-add-expense').style.display = 'inline-flex';
  document.getElementById('btn-add-fuel').style.display = 'none';
  renderExpenses();
});

document.getElementById('tab-fuel').addEventListener('click', () => {
  document.getElementById('tab-expenses').classList.remove('btn-primary');
  document.getElementById('tab-fuel').classList.add('btn-primary');
  document.getElementById('sub-expenses-view').style.display = 'none';
  document.getElementById('sub-fuel-view').style.display = 'block';
  document.getElementById('btn-add-expense').style.display = 'none';
  document.getElementById('btn-add-fuel').style.display = 'inline-flex';
  renderExpenses();
});

// Search listeners
document.getElementById('expense-search').addEventListener('input', renderExpenses);
document.getElementById('expense-filter-category').addEventListener('change', renderExpenses);
document.getElementById('fuel-search').addEventListener('input', renderExpenses);

// Populating Vehicle and Trip dropdown selections in Expense forms
function populateExpenseSelectors(vehicleSelectId, tripSelectId) {
  const vSelect = document.getElementById(vehicleSelectId);
  const tSelect = document.getElementById(tripSelectId);
  
  vSelect.innerHTML = '<option value="">-- Choose Vehicle --</option>';
  state.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.name_model} (${v.registration_number})`;
    vSelect.appendChild(opt);
  });
  
  tSelect.innerHTML = '<option value="">-- None --</option>';
  state.trips.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `#TR-${t.id} (${t.source} to ${t.destination})`;
    tSelect.appendChild(opt);
  });
}

// Add Expense Modal open
document.getElementById('btn-add-expense').addEventListener('click', () => {
  document.getElementById('expense-form').reset();
  document.getElementById('exp-date').value = new Date().toISOString().split('T')[0];
  populateExpenseSelectors('exp-vehicle', 'exp-trip');
  openModal('modal-expense');
});

// Submit Expense
document.getElementById('expense-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const vehId = Number(document.getElementById('exp-vehicle').value);
  const cat = document.getElementById('exp-category').value;
  const amount = Number(document.getElementById('exp-amount').value);
  const date = document.getElementById('exp-date').value;
  const tripIdVal = document.getElementById('exp-trip').value;
  const tripId = tripIdVal ? Number(tripIdVal) : null;
  const desc = document.getElementById('exp-desc').value.trim();
  
  const newId = state.expenses.length > 0 ? Math.max(...state.expenses.map(ex => ex.id)) + 1 : 1;
  state.expenses.push({
    id: newId,
    vehicle_id: vehId,
    trip_id: tripId,
    category: cat,
    description: desc,
    amount: amount,
    date: date
  });
  
  saveStateToLocal();
  closeAllModals();
  renderExpenses();
  showToast('Expense recorded successfully.', 'success');
});

// Add Fuel Log Modal open
document.getElementById('btn-add-fuel').addEventListener('click', () => {
  document.getElementById('fuel-form').reset();
  document.getElementById('fuel-date').value = new Date().toISOString().split('T')[0];
  populateExpenseSelectors('fuel-vehicle', 'fuel-trip');
  openModal('modal-fuel');
});

// Submit Fuel Log
document.getElementById('fuel-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const vehId = Number(document.getElementById('fuel-vehicle').value);
  const date = document.getElementById('fuel-date').value;
  const liters = Number(document.getElementById('fuel-liters').value);
  const cost = Number(document.getElementById('fuel-cost').value);
  const tripIdVal = document.getElementById('fuel-trip').value;
  const tripId = tripIdVal ? Number(tripIdVal) : null;
  
  const newId = state.fuel.length > 0 ? Math.max(...state.fuel.map(f => f.id)) + 1 : 1;
  state.fuel.push({
    id: newId,
    vehicle_id: vehId,
    trip_id: tripId,
    liters: liters,
    cost: cost,
    date: date
  });
  
  // Automatically record fuel refill as operation expense
  const newExpId = state.expenses.length > 0 ? Math.max(...state.expenses.map(ex => ex.id)) + 1 : 1;
  state.expenses.push({
    id: newExpId,
    vehicle_id: vehId,
    trip_id: tripId,
    category: 'fuel',
    description: `Fuel refill: ${liters} liters`,
    amount: cost,
    date: date
  });
  
  saveStateToLocal();
  closeAllModals();
  renderExpenses();
  showToast('Fuel refill logged and Operation Expense recorded.', 'success');
});

// --- REPORTS & ROI ---
function renderReports() {
  const tbody = document.getElementById('reports-table-body');
  tbody.innerHTML = '';
  
  let totalDistanceSum = 0;
  let totalFuelSum = 0;
  let totalOperationSpend = 0;
  let totalMaintenanceSpend = 0;
  
  // Calculate aggregate operations expenses
  state.expenses.forEach(ex => {
    totalOperationSpend += Number(ex.amount);
  });
  
  state.maintenance.filter(m => m.status === 'closed').forEach(m => {
    totalMaintenanceSpend += Number(m.cost);
  });
  
  // Vehicle ROI details list
  state.vehicles.forEach(v => {
    const relatedTrips = state.trips.filter(t => t.vehicle_id === v.id && t.status === 'completed');
    const distanceSum = relatedTrips.reduce((acc, curr) => acc + Number(curr.actual_distance || 0), 0);
    const fuelSum = relatedTrips.reduce((acc, curr) => acc + Number(curr.fuel_consumed || 0), 0);
    
    totalDistanceSum += distanceSum;
    totalFuelSum += fuelSum;
    
    // Financial calculations
    const fuelExpenses = state.expenses.filter(ex => ex.vehicle_id === v.id && ex.category === 'fuel');
    const fuelCostSum = fuelExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    const maintenanceLogs = state.maintenance.filter(m => m.vehicle_id === v.id && m.status === 'closed');
    const maintCostSum = maintenanceLogs.reduce((acc, curr) => acc + Number(curr.cost), 0);
    
    const otherExpenses = state.expenses.filter(ex => ex.vehicle_id === v.id && ex.category !== 'fuel' && ex.category !== 'maintenance');
    const otherCostSum = otherExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    const totalVehExpenses = fuelCostSum + maintCostSum + otherCostSum;
    
    // Tariff estimate for Revenue calculation: cargo_weight * actual_distance * ₹0.05 per kg-km
    const estimatedRevenue = relatedTrips.reduce((acc, curr) => {
      return acc + (Number(curr.cargo_weight) * Number(curr.actual_distance) * 0.05);
    }, 0);
    
    // ROI: [Revenue - (Maintenance + Fuel)] / Acquisition Cost
    // Using the exact PDF formula: (Revenue - (Maint + Fuel)) / Acquisition Cost
    const totalMaintAndFuel = maintCostSum + fuelCostSum;
    const netReturn = estimatedRevenue - totalMaintAndFuel;
    const roiVal = v.acquisition_cost > 0 ? (netReturn / v.acquisition_cost) * 100 : 0;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight:600;">${v.name_model}</div>
        <span style="font-size:11px; color:var(--text-secondary);">${v.registration_number} (${v.type})</span>
      </td>
      <td>₹${Number(v.acquisition_cost).toLocaleString()}</td>
      <td>${Number(v.odometer).toLocaleString()} km</td>
      <td>₹${fuelCostSum.toLocaleString()}</td>
      <td>₹${maintCostSum.toLocaleString()}</td>
      <td style="color:var(--success); font-weight:500;">₹${Math.round(estimatedRevenue).toLocaleString()}</td>
      <td>
        <span style="font-weight:600; color: ${roiVal >= 0 ? 'var(--success)' : 'var(--danger)'}">
          ${roiVal.toFixed(2)}%
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Set report counters
  const overallEfficiency = totalFuelSum > 0 ? (totalDistanceSum / totalFuelSum) : 0;
  document.getElementById('report-avg-efficiency').textContent = `${overallEfficiency.toFixed(2)} km/L`;
  document.getElementById('report-total-cost').textContent = `₹${totalOperationSpend.toLocaleString()}`;
  document.getElementById('report-total-maintenance').textContent = `₹${totalMaintenanceSpend.toLocaleString()}`;
}

// CSV Export
document.getElementById('btn-export-reports').addEventListener('click', () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Vehicle Model,Registration,Type,Acquisition Cost,Odometer (km),Fuel Spend (INR),Maintenance Spend (INR),Estimated Revenue (INR),ROI (%)\n";
  
  state.vehicles.forEach(v => {
    const relatedTrips = state.trips.filter(t => t.vehicle_id === v.id && t.status === 'completed');
    const fuelCostSum = state.expenses.filter(ex => ex.vehicle_id === v.id && ex.category === 'fuel').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const maintCostSum = state.maintenance.filter(m => m.vehicle_id === v.id && m.status === 'closed').reduce((acc, curr) => acc + Number(curr.cost), 0);
    
    const estimatedRevenue = relatedTrips.reduce((acc, curr) => {
      return acc + (Number(curr.cargo_weight) * Number(curr.actual_distance) * 0.05);
    }, 0);
    
    const roiVal = v.acquisition_cost > 0 ? ((estimatedRevenue - (maintCostSum + fuelCostSum)) / v.acquisition_cost) * 100 : 0;
    
    csvContent += `"${v.name_model}","${v.registration_number}","${v.type}",${v.acquisition_cost},${v.odometer},${fuelCostSum},${maintCostSum},${Math.round(estimatedRevenue)},${roiVal.toFixed(2)}\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `transitops_fleet_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Reports table exported to CSV.', 'success');
});
