package com.parking.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.parking.system.dto.ApiResponse;
import com.parking.system.dto.CreateTicketRequest;
import com.parking.system.entity.Ticket;
import com.parking.system.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class TicketController {

    @Autowired
    private TicketService ticketService;
    
    /**
     * API tạo vé mới (Check-in)
     * POST /api/tickets
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> createTicket(@RequestBody CreateTicketRequest request) {
        try {
            Ticket ticket = ticketService.createTicket(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Tạo vé thành công", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    /**
     * API xử lý xuất bãi (Check-out)
     * POST /api/tickets/{id}/checkout
     */
    @PostMapping("/{id}/checkout")
    public ResponseEntity<ApiResponse<Ticket>> checkoutTicket(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.processExit(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Xuất bãi thành công", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    /**
     * API lấy tất cả vé
     * GET /api/tickets
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Ticket>>> getAllTickets() {
        try {
            List<Ticket> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách vé thành công", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    /**
     * API lấy vé theo ID
     * GET /api/tickets/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getTicketById(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin vé thành công", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    /**
     * API tìm vé theo biển số
     * GET /api/tickets/search?plateNumber={plateNumber}
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Ticket>> searchByPlateNumber(@RequestParam String plateNumber) {
        try {
            Ticket ticket = ticketService.getActiveTicketByLicensePlate(plateNumber);
            return ResponseEntity.ok(new ApiResponse<>(true, "Tìm thấy vé", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    /**
     * API lấy danh sách vé đang hoạt động
     * GET /api/tickets/active
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Ticket>>> getActiveTickets() {
        try {
            List<Ticket> tickets = ticketService.getActiveTickets();
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách vé đang hoạt động thành công", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
