package com.parking.system.dto;

import java.util.List;

import com.parking.system.entity.ParkingSlot;

public class ZoneWithSlotsResponse {
    private Long id;
    private String name;
    private String vehicleType;
    private Integer totalSlots;
    private Long availableSlots;
    private Long occupiedSlots;
    private List<ParkingSlot> slots;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getVehicleType() {
        return vehicleType;
    }
    
    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }
    
    public Integer getTotalSlots() {
        return totalSlots;
    }
    
    public void setTotalSlots(Integer totalSlots) {
        this.totalSlots = totalSlots;
    }
    
    public Long getAvailableSlots() {
        return availableSlots;
    }
    
    public void setAvailableSlots(Long availableSlots) {
        this.availableSlots = availableSlots;
    }
    
    public Long getOccupiedSlots() {
        return occupiedSlots;
    }
    
    public void setOccupiedSlots(Long occupiedSlots) {
        this.occupiedSlots = occupiedSlots;
    }
    
    public List<ParkingSlot> getSlots() {
        return slots;
    }
    
    public void setSlots(List<ParkingSlot> slots) {
        this.slots = slots;
    }
}
