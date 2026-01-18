package com.parking.system.dto;

import com.parking.system.entity.ParkingZone;

public class CreateTicketRequest {
    private String licensePlate;
    private ParkingZone.VehicleType vehicleType;
    private Long zoneId;  // Thêm zoneId để xác định khu vực
    
    public String getLicensePlate() {
        return licensePlate;
    }
    
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }
    
    public ParkingZone.VehicleType getVehicleType() {
        return vehicleType;
    }
    
    public void setVehicleType(ParkingZone.VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }
    
    public Long getZoneId() {
        return zoneId;
    }
    
    public void setZoneId(Long zoneId) {
        this.zoneId = zoneId;
    }
}
