-- ====================================================================
-- SCRIPT RESET HOÀN TOÀN DATABASE - PARKING MANAGEMENT SYSTEM
-- Chạy script này để xóa và tạo lại database từ đầu
-- ====================================================================

-- Bước 1: Xóa tất cả tables cũ (nếu có)
DROP TABLE IF EXISTS monthly_tickets;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS parking_slots;
DROP TABLE IF EXISTS parking_zones;
DROP TABLE IF EXISTS users;

-- ====================================================================
-- Bước 2: Tạo lại các tables
-- ====================================================================

-- Table: users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: parking_zones
CREATE TABLE parking_zones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    total_slots INT NOT NULL,
    INDEX idx_vehicle_type (vehicle_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: parking_slots
CREATE TABLE parking_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    zone_id BIGINT NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES parking_zones(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_zone_status (zone_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tickets
CREATE TABLE tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    entry_time DATETIME NOT NULL,
    exit_time DATETIME NULL,
    slot_id BIGINT NULL,
    total_amount DOUBLE NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE SET NULL,
    INDEX idx_license_status (license_plate, status),
    INDEX idx_status_entry (status, entry_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: monthly_tickets
CREATE TABLE monthly_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id VARCHAR(50) NOT NULL UNIQUE,
    license_plate VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_fee DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    INDEX idx_card (card_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- Bước 3: Insert dữ liệu mẫu
-- ====================================================================

-- 3.1. Tạo users (password: admin123)
-- BCrypt hash: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
INSERT INTO users (username, password, full_name, role, active) VALUES
('admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Administrator', 'ADMIN', true),
('nhanvien', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Nhân viên', 'EMPLOYEE', true);

-- 3.2. Tạo parking zones
INSERT INTO parking_zones (id, name, vehicle_type, total_slots) VALUES
(1, 'Khu A - Xe Máy', 'MOTORBIKE', 20),
(2, 'Khu B - Ô Tô', 'CAR', 12);

-- 3.3. Tạo parking slots cho Khu A (Xe máy)
INSERT INTO parking_slots (slot_number, status, zone_id) VALUES
('A-01', 'AVAILABLE', 1),
('A-02', 'AVAILABLE', 1),
('A-03', 'AVAILABLE', 1),
('A-04', 'AVAILABLE', 1),
('A-05', 'AVAILABLE', 1),
('A-06', 'AVAILABLE', 1),
('A-07', 'AVAILABLE', 1),
('A-08', 'AVAILABLE', 1),
('A-09', 'AVAILABLE', 1),
('A-10', 'AVAILABLE', 1),
('A-11', 'AVAILABLE', 1),
('A-12', 'AVAILABLE', 1),
('A-13', 'AVAILABLE', 1),
('A-14', 'AVAILABLE', 1),
('A-15', 'AVAILABLE', 1),
('A-16', 'AVAILABLE', 1),
('A-17', 'AVAILABLE', 1),
('A-18', 'AVAILABLE', 1),
('A-19', 'AVAILABLE', 1),
('A-20', 'AVAILABLE', 1);

-- 3.4. Tạo parking slots cho Khu B (Ô tô)
INSERT INTO parking_slots (slot_number, status, zone_id) VALUES
('B-01', 'AVAILABLE', 2),
('B-02', 'AVAILABLE', 2),
('B-03', 'AVAILABLE', 2),
('B-04', 'AVAILABLE', 2),
('B-05', 'AVAILABLE', 2),
('B-06', 'AVAILABLE', 2),
('B-07', 'AVAILABLE', 2),
('B-08', 'AVAILABLE', 2),
('B-09', 'AVAILABLE', 2),
('B-10', 'AVAILABLE', 2),
('B-11', 'AVAILABLE', 2),
('B-12', 'AVAILABLE', 2);

-- ====================================================================
-- Bước 4: Kiểm tra dữ liệu
-- ====================================================================
SELECT '=== USERS ===' as Info;
SELECT id, username, full_name, role, active FROM users;

SELECT '=== PARKING ZONES ===' as Info;
SELECT * FROM parking_zones;

SELECT '=== PARKING SLOTS ===' as Info;
SELECT COUNT(*) as TotalSlots, zone_id, status FROM parking_slots GROUP BY zone_id, status;

SELECT '=== SETUP COMPLETED ===' as Info;
SELECT 
    (SELECT COUNT(*) FROM users) as Users,
    (SELECT COUNT(*) FROM parking_zones) as Zones,
    (SELECT COUNT(*) FROM parking_slots) as Slots,
    (SELECT COUNT(*) FROM tickets) as Tickets;

