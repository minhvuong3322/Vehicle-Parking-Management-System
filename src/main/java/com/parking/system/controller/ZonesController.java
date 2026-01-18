package com.parking.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parking.system.dto.ApiResponse;
import com.parking.system.dto.AvailableSlotsResponse;
import com.parking.system.entity.ParkingSlot;
import com.parking.system.entity.ParkingZone;
import com.parking.system.repository.ParkingSlotRepository;
import com.parking.system.repository.ParkingZoneRepository;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ZonesController {
    
    @Autowired
    private ParkingZoneRepository parkingZoneRepository;
    
    @Autowired
    private ParkingSlotRepository parkingSlotRepository;
    
    /**
     * Lấy tất cả zones
     * GET /api/zones
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ParkingZone>>> getAllZones() {
        try {
            List<ParkingZone> zones = parkingZoneRepository.findAll();
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách zones thành công", zones));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    /**
     * Lấy danh sách slot trống
     * GET /api/zones/available-slots
     */
    @GetMapping("/available-slots")
    public ResponseEntity<ApiResponse<AvailableSlotsResponse>> getAvailableSlots() {
        try {
            List<ParkingSlot> availableSlots = parkingSlotRepository.findByStatus(ParkingSlot.Status.AVAILABLE);
            AvailableSlotsResponse response = new AvailableSlotsResponse(
                availableSlots.size(),
                availableSlots
            );
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách slot trống thành công", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}

