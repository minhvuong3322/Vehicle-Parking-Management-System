package com.parking.system.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.parking.system.dto.ApiResponse;
import com.parking.system.entity.Ticket;
import com.parking.system.repository.TicketRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ReportController {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    /**
     * API lấy doanh thu theo ngày
     * GET /api/reports/revenue/daily?date=2024-01-18
     */
    @GetMapping("/revenue/daily")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailyRevenue(@RequestParam String date) {
        try {
            LocalDate targetDate = LocalDate.parse(date);
            LocalDateTime startOfDay = targetDate.atStartOfDay();
            LocalDateTime endOfDay = targetDate.plusDays(1).atStartOfDay();
            
            // Lấy tất cả tickets đã completed trong ngày
            var tickets = ticketRepository.findByStatusAndEntryTimeBetween(
                Ticket.Status.COMPLETED,
                startOfDay,
                endOfDay
            );
            
            // Tính tổng doanh thu
            double totalRevenue = tickets.stream()
                .mapToDouble(t -> t.getTotalAmount() != null ? t.getTotalAmount() : 0.0)
                .sum();
            
            Map<String, Object> result = new HashMap<>();
            result.put("date", date);
            result.put("revenue", totalRevenue);
            result.put("ticketCount", tickets.size());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy doanh thu thành công", result));
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("date", date);
            result.put("revenue", 0.0);
            result.put("ticketCount", 0);
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy doanh thu thành công", result));
        }
    }
    
    /**
     * API tổng hợp báo cáo
     * GET /api/reports
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGeneralReport() {
        try {
            // Thống kê tổng quan
            Map<String, Object> report = new HashMap<>();
            report.put("totalTickets", ticketRepository.count());
            report.put("activeTickets", ticketRepository.findByIdAndStatus(null, Ticket.Status.ACTIVE).map(t -> 1L).orElse(0L));
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy báo cáo thành công", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}

