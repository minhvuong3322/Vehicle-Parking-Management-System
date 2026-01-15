package com.parking.system.dto;

import java.util.List;

import com.parking.system.entity.ParkingSlot;

public class AvailableSlotsResponse {
    private Integer total;
    private List<ParkingSlot> slots;
    
    public AvailableSlotsResponse(Integer total, List<ParkingSlot> slots) {
        this.total = total;
        this.slots = slots;
    }
    
    // Getters and Setters
    public Integer getTotal() {
        return total;
    }
    
    public void setTotal(Integer total) {
        this.total = total;
    }
    
    public List<ParkingSlot> getSlots() {
        return slots;
    }
    
    public void setSlots(List<ParkingSlot> slots) {
        this.slots = slots;
    }
}
