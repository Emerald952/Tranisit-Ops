-- ============================================================
-- TransitOps — Smart Transport Operations Platform
-- PostgreSQL Database Schema
-- ============================================================

-- Clean up existing objects (in reverse dependency order)
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS fuel_logs CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS vehicle_status CASCADE;
DROP TYPE IF EXISTS vehicle_type CASCADE;
DROP TYPE IF EXISTS driver_status CASCADE;
DROP TYPE IF EXISTS trip_status CASCADE;
DROP TYPE IF EXISTS maintenance_type CASCADE;
DROP TYPE IF EXISTS maintenance_status CASCADE;
DROP TYPE IF EXISTS expense_category CASCADE;


-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'fleet_manager',
    'driver',
    'safety_officer',
    'financial_analyst'
);

CREATE TYPE vehicle_status AS ENUM (
    'available',
    'on_trip',
    'in_shop',
    'retired'
);

CREATE TYPE vehicle_type AS ENUM (
    'truck',
    'van',
    'bus',
    'car',
    'motorcycle'
);

CREATE TYPE driver_status AS ENUM (
    'available',
    'on_trip',
    'off_duty',
    'suspended'
);

CREATE TYPE trip_status AS ENUM (
    'draft',
    'dispatched',
    'completed',
    'cancelled'
);

CREATE TYPE maintenance_type AS ENUM (
    'oil_change',
    'tire_replacement',
    'brake_service',
    'engine_repair',
    'general_service',
    'other'
);

CREATE TYPE maintenance_status AS ENUM (
    'active',
    'closed'
);

CREATE TYPE expense_category AS ENUM (
    'toll',
    'maintenance',
    'fuel',
    'insurance',
    'other'
);


-- ============================================================
-- TABLE: users
-- ============================================================

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    role            user_role    NOT NULL DEFAULT 'driver',
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role  ON users (role);


-- ============================================================
-- TABLE: vehicles
-- ============================================================

CREATE TABLE vehicles (
    id                    SERIAL         PRIMARY KEY,
    registration_number   VARCHAR(50)    NOT NULL UNIQUE,
    name_model            VARCHAR(150)   NOT NULL,
    type                  vehicle_type   NOT NULL,
    max_load_capacity     DECIMAL(10,2)  NOT NULL CHECK (max_load_capacity > 0),
    odometer              DECIMAL(12,2)  NOT NULL DEFAULT 0 CHECK (odometer >= 0),
    acquisition_cost      DECIMAL(14,2)  NOT NULL DEFAULT 0 CHECK (acquisition_cost >= 0),
    status                vehicle_status NOT NULL DEFAULT 'available',
    region                VARCHAR(100),
    created_at            TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_status ON vehicles (status);
CREATE INDEX idx_vehicles_type   ON vehicles (type);
CREATE INDEX idx_vehicles_region ON vehicles (region);


-- ============================================================
-- TABLE: drivers
-- ============================================================

CREATE TABLE drivers (
    id                  SERIAL         PRIMARY KEY,
    name                VARCHAR(150)   NOT NULL,
    license_number      VARCHAR(50)    NOT NULL UNIQUE,
    license_category    VARCHAR(20)    NOT NULL,
    license_expiry_date DATE           NOT NULL,
    contact_number      VARCHAR(20)    NOT NULL,
    safety_score        DECIMAL(5,2)   NOT NULL DEFAULT 100.00 CHECK (safety_score >= 0 AND safety_score <= 100),
    status              driver_status  NOT NULL DEFAULT 'available',
    created_at          TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drivers_status         ON drivers (status);
CREATE INDEX idx_drivers_license_expiry ON drivers (license_expiry_date);


-- ============================================================
-- TABLE: trips
-- ============================================================

CREATE TABLE trips (
    id               SERIAL        PRIMARY KEY,
    source           VARCHAR(255)  NOT NULL,
    destination      VARCHAR(255)  NOT NULL,
    vehicle_id       INT           NOT NULL,
    driver_id        INT           NOT NULL,
    cargo_weight     DECIMAL(10,2) NOT NULL CHECK (cargo_weight > 0),
    planned_distance DECIMAL(12,2) NOT NULL CHECK (planned_distance > 0),
    actual_distance  DECIMAL(12,2)          CHECK (actual_distance >= 0),
    fuel_consumed    DECIMAL(10,2)          CHECK (fuel_consumed >= 0),
    final_odometer   DECIMAL(12,2)          CHECK (final_odometer >= 0),
    status           trip_status   NOT NULL DEFAULT 'draft',
    dispatched_at    TIMESTAMP,
    completed_at     TIMESTAMP,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_trips_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_trips_driver
        FOREIGN KEY (driver_id) REFERENCES drivers (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_trips_status     ON trips (status);
CREATE INDEX idx_trips_vehicle_id ON trips (vehicle_id);
CREATE INDEX idx_trips_driver_id  ON trips (driver_id);


-- ============================================================
-- TABLE: maintenance_logs
-- ============================================================

CREATE TABLE maintenance_logs (
    id          SERIAL             PRIMARY KEY,
    vehicle_id  INT                NOT NULL,
    description VARCHAR(500)       NOT NULL,
    type        maintenance_type   NOT NULL DEFAULT 'general_service',
    cost        DECIMAL(12,2)      NOT NULL DEFAULT 0 CHECK (cost >= 0),
    status      maintenance_status NOT NULL DEFAULT 'active',
    started_at  TIMESTAMP          NOT NULL DEFAULT NOW(),
    closed_at   TIMESTAMP,
    created_at  TIMESTAMP          NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP          NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_maintenance_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_maintenance_vehicle_id ON maintenance_logs (vehicle_id);
CREATE INDEX idx_maintenance_status     ON maintenance_logs (status);


-- ============================================================
-- TABLE: fuel_logs
-- ============================================================

CREATE TABLE fuel_logs (
    id          SERIAL        PRIMARY KEY,
    vehicle_id  INT           NOT NULL,
    trip_id     INT,
    liters      DECIMAL(10,2) NOT NULL CHECK (liters > 0),
    cost        DECIMAL(12,2) NOT NULL CHECK (cost >= 0),
    date        DATE          NOT NULL DEFAULT CURRENT_DATE,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_fuel_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_fuel_trip
        FOREIGN KEY (trip_id) REFERENCES trips (id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_fuel_vehicle_id ON fuel_logs (vehicle_id);
CREATE INDEX idx_fuel_trip_id    ON fuel_logs (trip_id);
CREATE INDEX idx_fuel_date       ON fuel_logs (date);


-- ============================================================
-- TABLE: expenses
-- ============================================================

CREATE TABLE expenses (
    id          SERIAL           PRIMARY KEY,
    vehicle_id  INT              NOT NULL,
    trip_id     INT,
    category    expense_category NOT NULL,
    description VARCHAR(500)     NOT NULL,
    amount      DECIMAL(12,2)    NOT NULL CHECK (amount >= 0),
    date        DATE             NOT NULL DEFAULT CURRENT_DATE,
    created_at  TIMESTAMP        NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_expense_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_expense_trip
        FOREIGN KEY (trip_id) REFERENCES trips (id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_expenses_vehicle_id ON expenses (vehicle_id);
CREATE INDEX idx_expenses_trip_id    ON expenses (trip_id);
CREATE INDEX idx_expenses_category   ON expenses (category);
CREATE INDEX idx_expenses_date       ON expenses (date);


-- ============================================================
-- TRIGGER: auto-update updated_at on row modification
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_drivers_updated_at
    BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_maintenance_updated_at
    BEFORE UPDATE ON maintenance_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- DONE
-- ============================================================
