package com.parking.system.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.parking.system.entity.ParkingZone;

@Service
public class FeeCalculationService {

    // Cấu hình giá tiền 
    private static final double MOTO_BLOCK_1 = 5000.0;  // Xe máy: 2h đầu
    private static final double MOTO_NEXT    = 2000.0;  // Xe máy: các giờ sau
    
    private static final double CAR_BLOCK_1  = 10000.0; // Ô tô: 2h đầu
    private static final double CAR_NEXT     = 5000.0;  // Ô tô: các giờ sau

    // Block đầu tiên tính là 2 giờ
    private static final long FIRST_BLOCK_HOURS = 2;

    public Double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime, ParkingZone.VehicleType vehicleType) {
        // Validate dữ liệu đầu vào
        if (entryTime == null || exitTime == null || vehicleType == null) {
            return 0.0;
        }

        if (exitTime.isBefore(entryTime)) {
            throw new IllegalArgumentException("Giờ ra không thể trước giờ vào");
        }

        // Tính thời gian gửi 
        long minutes = Duration.between(entryTime, exitTime).toMinutes();
        long hours = (long) Math.ceil(minutes / 60.0);
        
        // Nếu gửi chưa đến 1 phút cũng tính tối thiểu là block đầu
        if (hours == 0) hours = 1; 

        // Chọn công thức theo loại xe
        if (vehicleType == ParkingZone.VehicleType.MOTORBIKE) {
            return calculate(hours, MOTO_BLOCK_1, MOTO_NEXT);
        } else {
            return calculate(hours, CAR_BLOCK_1, CAR_NEXT);
        }
    }

    // Công thức tính toán chung
    private Double calculate(long totalHours, double firstBlockPrice, double nextHourPrice) {
        if (totalHours <= FIRST_BLOCK_HOURS) {
            return firstBlockPrice;
        } else {
            long extraHours = totalHours - FIRST_BLOCK_HOURS;
            return firstBlockPrice + (extraHours * nextHourPrice);
        }
    }
}