-- =======================================================
-- SMART-COMMUTE AI: Database Schema & Seed Data
-- Database Name: smart_commute_ai
-- =======================================================

CREATE DATABASE IF NOT EXISTS smart_commute_ai;
USE smart_commute_ai;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    start_latitude DECIMAL(10, 8) NOT NULL,
    start_longitude DECIMAL(11, 8) NOT NULL,
    destination_latitude DECIMAL(10, 8) NOT NULL,
    destination_longitude DECIMAL(11, 8) NOT NULL,
    risk_score INT NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    recommended_route TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Traffic Data Table
CREATE TABLE IF NOT EXISTS traffic_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    congestion_level VARCHAR(50) NOT NULL,
    average_speed DECIMAL(6, 2) NOT NULL,
    vehicle_count INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Hazards Table
CREATE TABLE IF NOT EXISTS hazards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    hazard_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT,
    reported_by VARCHAR(255) DEFAULT 'Commuter Report',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Weather Data Table
CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    humidity DECIMAL(5, 2) NOT NULL,
    rainfall DECIMAL(5, 2) NOT NULL,
    visibility DECIMAL(5, 2) NOT NULL,
    wind_speed DECIMAL(5, 2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Emergency Reports Table
CREATE TABLE IF NOT EXISTS emergency_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    emergency_type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. IoT Sensor Data Table (Intelligent Device Integration)
CREATE TABLE IF NOT EXISTS iot_sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(6, 2) NOT NULL,
    vehicle_count INT NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    rainfall DECIMAL(5, 2) NOT NULL,
    hazard_detected BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================
-- Realistic Demo / Seed Records
-- Passwords are hashed with bcrypt for 'password123' ($2b$10$0z8qG2aF8Vw580iQ/8Yf0eQ.x7e.N4u/4rD6K.YjO4fQ/52h1717S)
-- =======================================================

-- Users (Admin and Standard Users)
-- Admin: admin@smartcommute.ai / password123
-- User: commuter@smartcommute.ai / password123
INSERT INTO users (id, name, email, password, phone, role) VALUES
(1, 'Admin Controller', 'admin@smartcommute.ai', '$2b$10$SCfzsAmY8a0J8.6/b0tk/.NbS8q8atnv2Tqv.vAZbIseeap.e3Ece', '+91 9876543210', 'admin'),
(2, 'Alex Morgan', 'commuter@smartcommute.ai', '$2b$10$SCfzsAmY8a0J8.6/b0tk/.NbS8q8atnv2Tqv.vAZbIseeap.e3Ece', '+91 9123456789', 'user'),
(3, 'Priya Sharma', 'priya.sharma@example.com', '$2b$10$SCfzsAmY8a0J8.6/b0tk/.NbS8q8atnv2Tqv.vAZbIseeap.e3Ece', '+91 9988776655', 'user')
ON DUPLICATE KEY UPDATE password=VALUES(password);

-- Traffic Data (Major Transit Corridors - Bangalore / South Metro Hub)
INSERT INTO traffic_data (latitude, longitude, congestion_level, average_speed, vehicle_count) VALUES
(12.9716, 77.5946, 'Moderate', 34.50, 1240),
(12.9352, 77.6245, 'Heavy', 18.20, 2450),
(12.9279, 77.6271, 'Critical', 11.00, 3120),
(12.9984, 77.5921, 'Low', 52.00, 680),
(13.0358, 77.5970, 'Moderate', 38.00, 1420),
(12.9166, 77.6101, 'Heavy', 21.40, 2180),
(13.0827, 80.2707, 'Heavy', 24.00, 2800),
(13.0405, 80.2337, 'Moderate', 36.50, 1650);

-- Hazards
INSERT INTO hazards (latitude, longitude, hazard_type, severity, description, reported_by) VALUES
(12.9355, 77.6150, 'Pothole', 'Moderate', 'Deep asphalt pothole in middle lane near Silk Board junction', 'Commuter #104'),
(12.9510, 77.6400, 'Accident', 'Critical', 'Multi-vehicle collision blocking two right lanes, emergency services on site', 'Traffic Patrol #04'),
(12.9780, 77.6410, 'Road Block', 'High', 'Underground metro line construction detour in progress', 'Municipal Corporation'),
(12.9210, 77.6850, 'Flood', 'High', 'Waterlogging due to overnight rain, slow moving traffic', 'Commuter #215'),
(13.0100, 77.5550, 'Construction', 'Low', 'Shoulder barricading and resurfacing work active', 'Road Works Dept'),
(12.9620, 77.5850, 'Traffic Jam', 'High', 'Bottleneck at flyover ramp during peak hours', 'Sensor Node #12'),
(12.9890, 77.6010, 'Broken Signal', 'Moderate', 'Traffic lights flashing yellow at 4-way intersection', 'Patrol Officer Raj');

-- Weather Data
INSERT INTO weather_data (location, temperature, humidity, rainfall, visibility, wind_speed) VALUES
('Bengaluru Central Hub', 27.50, 68.00, 15.00, 8.50, 14.00),
('Electronics City Corridor', 28.20, 72.00, 25.00, 7.00, 16.50),
('Whitefield Tech Zone', 26.80, 65.00, 10.00, 9.20, 12.00),
('Chennai Coastal Expressway', 31.00, 80.00, 5.00, 10.00, 18.00),
('Airport Expressway Zone', 25.40, 60.00, 0.00, 10.00, 11.20);

-- Emergency Reports
INSERT INTO emergency_reports (user_id, latitude, longitude, emergency_type, description, status) VALUES
(2, 12.9512, 77.6398, 'Accident', 'Two-wheeler involved in skid near outer ring road service lane. First aid requested.', 'Dispatched'),
(3, 12.9150, 77.6080, 'Vehicle Breakdown', 'Heavy transport truck engine stalled blocking left lane', 'Investigating'),
(NULL, 12.9730, 77.5960, 'Road Block', 'Fallen tree limb restricting lane clearance after thunderstorm', 'Resolved');

-- Route Analysis History
INSERT INTO routes (user_id, start_latitude, start_longitude, destination_latitude, destination_longitude, risk_score, risk_level, recommended_route) VALUES
(2, 12.97160000, 77.59460000, 12.93520000, 77.62450000, 72, 'HIGH', 'Consider taking Inner Ring Road detour to avoid critical congestion at Silk Board and reported multi-vehicle accident.'),
(2, 12.97160000, 77.59460000, 13.03580000, 77.59700000, 28, 'LOW', 'Direct North Expressway corridor is clear with high visibility and minimal congestion.'),
(3, 12.93520000, 77.62450000, 12.98500000, 77.73000000, 55, 'MODERATE', 'Route is usable. Moderate delays anticipated around Koramangala and waterlogging pockets.');

-- IoT Sensor Feeds
INSERT INTO iot_sensor_data (device_id, latitude, longitude, speed, vehicle_count, temperature, rainfall, hazard_detected) VALUES
('IOT-ESP32-NODE-01', 12.9716, 77.5946, 38.50, 85, 27.50, 0.00, FALSE),
('IOT-ESP32-NODE-02', 12.9352, 77.6245, 14.20, 195, 28.00, 12.50, TRUE),
('IOT-ESP32-NODE-03', 12.9984, 77.5921, 55.00, 42, 26.80, 0.00, FALSE);
