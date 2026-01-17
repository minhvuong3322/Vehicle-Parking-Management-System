-- =====================================================
-- DATA.SQL - Dữ liệu mẫu cho Hệ thống Quản lý Bãi xe
-- Database: parkingdb (MySQL)
-- =====================================================

-- Tắt foreign key checks tạm thời để xóa dữ liệu
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. XÓA DỮ LIỆU CŨ (nếu có)
-- =====================================================
DELETE FROM tickets;
DELETE FROM monthly_tickets;
DELETE FROM parking_slot;
DELETE FROM parking_zones;
DELETE FROM users;

-- Reset AUTO_INCREMENT
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE parking_zones AUTO_INCREMENT = 1;
ALTER TABLE parking_slot AUTO_INCREMENT = 1;
ALTER TABLE tickets AUTO_INCREMENT = 1;
ALTER TABLE monthly_tickets AUTO_INCREMENT = 1;

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 2. CHÈN DỮ LIỆU USERS
-- =====================================================
-- Password cho tất cả user: 123456
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMye1BYhRJAW7KOABdRvHCrwmT2Oa4FqBVS

INSERT INTO users (username, password, full_name, role, active) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye1BYhRJAW7KOABdRvHCrwmT2Oa4FqBVS', 'Nguyễn Văn Admin', 'ADMIN', true),
('nhanvien1', '$2a$10$N9qo8uLOickgx2ZMRZoMye1BYhRJAW7KOABdRvHCrwmT2Oa4FqBVS', 'Trần Thị Lan', 'EMPLOYEE', true),
('nhanvien2', '$2a$10$N9qo8uLOickgx2ZMRZoMye1BYhRJAW7KOABdRvHCrwmT2Oa4FqBVS', 'Lê Văn Hùng', 'EMPLOYEE', true);

-- =====================================================
-- 3. CHÈN DỮ LIỆU PARKING ZONES
-- =====================================================
INSERT INTO parking_zones (name, vehicle_type, total_slots) VALUES
('Khu vực A', 'MOTORBIKE', 10),
('Khu vực B', 'CAR', 10);

-- =====================================================
-- 4. CHÈN DỮ LIỆU PARKING SLOTS
-- =====================================================

-- Khu A: 10 vị trí xe máy (zone_id = 1)
INSERT INTO parking_slot (slot_number, status, zone_id) VALUES
('A-01', 'AVAILABLE', 1),
('A-02', 'AVAILABLE', 1),
('A-03', 'AVAILABLE', 1),
('A-04', 'AVAILABLE', 1),
('A-05', 'AVAILABLE', 1),
('A-06', 'AVAILABLE', 1),
('A-07', 'AVAILABLE', 1),
('A-08', 'AVAILABLE', 1),
('A-09', 'AVAILABLE', 1),
('A-10', 'AVAILABLE', 1);

-- Khu B: 10 vị trí ô tô (zone_id = 2)
INSERT INTO parking_slot (slot_number, status, zone_id) VALUES
('B-01', 'AVAILABLE', 2),
('B-02', 'AVAILABLE', 2),
('B-03', 'AVAILABLE', 2),
('B-04', 'AVAILABLE', 2),
('B-05', 'AVAILABLE', 2),
('B-06', 'AVAILABLE', 2),
('B-07', 'AVAILABLE', 2),
('B-08', 'AVAILABLE', 2),
('B-09', 'AVAILABLE', 2),
('B-10', 'AVAILABLE', 2);

-- =====================================================
-- 5. XÁC NHẬN DỮ LIỆU ĐÃ CHÈN
-- =====================================================

-- Kiểm tra users
SELECT 'USERS' AS Table_Name, COUNT(*) AS Total_Records FROM users
UNION ALL
SELECT 'PARKING_ZONES', COUNT(*) FROM parking_zones
UNION ALL
SELECT 'PARKING_SLOT', COUNT(*) FROM parking_slot;

-- Xem chi tiết users (ẩn password)
SELECT id, username, full_name, role, active, 
       CONCAT(LEFT(password, 10), '...') AS password_preview 
FROM users 
ORDER BY id;

-- Xem chi tiết zones
SELECT z.id, z.name, z.vehicle_type, z.total_slots,
       COUNT(s.id) AS slots_created
FROM parking_zones z
LEFT JOIN parking_slot s ON z.id = s.zone_id
GROUP BY z.id, z.name, z.vehicle_type, z.total_slots
ORDER BY z.id;

-- Xem chi tiết slots
SELECT zone_id, 
       COUNT(*) AS total_slots,
       SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) AS available,
       SUM(CASE WHEN status = 'OCCUPIED' THEN 1 ELSE 0 END) AS occupied
FROM parking_slot
GROUP BY zone_id;

-- =====================================================
-- HOÀN TẤT
-- =====================================================
-- Dữ liệu mẫu đã được chèn thành công!
-- 
-- THÔNG TIN ĐĂNG NHẬP:
-- 
-- Admin Account:
--   Username: admin
--   Password: 123456
--   Role: ADMIN
-- 
-- Employee Accounts:
--   Username: nhanvien1 | Password: 123456 | Role: EMPLOYEE
--   Username: nhanvien2 | Password: 123456 | Role: EMPLOYEE
-- 
-- Parking Zones:
--   - Khu vực A: 10 vị trí xe máy (A-01 đến A-10)
--   - Khu vực B: 10 vị trí ô tô (B-01 đến B-10)
-- =====================================================

