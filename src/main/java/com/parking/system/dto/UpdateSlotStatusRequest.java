package com.parking.system.dto;

import com.parking.system.entity.ParkingSlot;

public class UpdateSlotStatusRequest {
    
    private ParkingSlot.Status status;
    
    public ParkingSlot.Status getStatus() {
        return status;
    }
    
    public void setStatus(ParkingSlot.Status status) {
        this.status = status;
    }
}
