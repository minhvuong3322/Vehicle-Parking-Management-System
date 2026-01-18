package com.parking.system.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parking.system.dto.CreateTicketRequest;
import com.parking.system.entity.ParkingSlot;
import com.parking.system.entity.ParkingZone;
import com.parking.system.entity.Ticket;
import com.parking.system.exception.InvalidRequestException;
import com.parking.system.exception.ResourceNotFoundException;
import com.parking.system.repository.ParkingSlotRepository;
import com.parking.system.repository.ParkingZoneRepository;
import com.parking.system.repository.TicketRepository;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private ParkingSlotRepository parkingSlotRepository;
    
    @Autowired
    private ParkingZoneRepository parkingZoneRepository;
    
    @Autowired
    private FeeCalculationService feeCalculationService;
    
    /**
     * Tạo vé xe mới (Check-in) - REWRITTEN BY SENIOR DEVELOPER
     * 
     * @param request Thông tin vé (biển số, loại xe, zoneId)
     * @return Ticket đã được tạo
     */
    @Transactional
    public Ticket createTicket(CreateTicketRequest request) {
        // ============================================
        // BƯỚC 1: VALIDATE DỮ LIỆU ĐẦU VÀO
        // ============================================
        
        if (request.getLicensePlate() == null || request.getLicensePlate().trim().isEmpty()) {
            throw new InvalidRequestException("Biển số xe không được để trống");
        }
        
        if (request.getVehicleType() == null) {
            throw new InvalidRequestException("Loại xe không được để trống");
        }
        
        if (request.getZoneId() == null) {
            throw new InvalidRequestException("Vui lòng chọn khu vực đỗ xe");
        }
        
        // ============================================
        // BƯỚC 2: VALIDATE ZONE TỒN TẠI
        // ============================================
        
        ParkingZone zone = parkingZoneRepository.findById(request.getZoneId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Không tìm thấy khu vực với ID: " + request.getZoneId()
            ));
        
        // Kiểm tra loại xe có khớp với zone không
        if (zone.getVehicleType() != request.getVehicleType()) {
            throw new InvalidRequestException(
                "Loại xe " + request.getVehicleType() + 
                " không phù hợp với khu vực " + zone.getName() + 
                " (chỉ dành cho " + zone.getVehicleType() + ")"
            );
        }
        
        // ============================================
        // BƯỚC 3: KIỂM TRA XE ĐÃ GỬI TRONG BÃI CHƯA
        // ============================================
        
        ticketRepository.findByLicensePlateAndStatus(request.getLicensePlate(), Ticket.Status.ACTIVE)
            .ifPresent(existingTicket -> {
                throw new InvalidRequestException(
                    "Xe có biển số " + request.getLicensePlate() + 
                    " đang gửi trong bãi (Vé #" + existingTicket.getId() + 
                    ", Slot: " + existingTicket.getSlot().getSlotNumber() + ")"
                );
            });
        
        // ============================================
        // BƯỚC 4: TÌM SLOT TRỐNG (CRITICAL)
        // ============================================
        
        ParkingSlot availableSlot = parkingSlotRepository
            .findFirstByZoneIdAndStatus(request.getZoneId(), ParkingSlot.Status.AVAILABLE)
            .orElseThrow(() -> new RuntimeException(
                "Khu vực " + zone.getName() + " đã hết chỗ trống. " +
                "Vui lòng chọn khu vực khác hoặc quay lại sau."
            ));
        
        // ============================================
        // BƯỚC 5: TẠO VÉ MỚI VÀ CẬP NHẬT SLOT
        // ============================================
        
        // Tạo vé mới
        Ticket ticket = new Ticket();
        ticket.setLicensePlate(request.getLicensePlate().trim().toUpperCase()); // Chuẩn hóa biển số
        ticket.setVehicleType(request.getVehicleType());
        ticket.setEntryTime(LocalDateTime.now());
        ticket.setSlot(availableSlot);
        ticket.setStatus(Ticket.Status.ACTIVE);
        
        // Cập nhật trạng thái slot NGAY LẬP TỨC (quan trọng để tránh race condition)
        availableSlot.setStatus(ParkingSlot.Status.OCCUPIED);
        parkingSlotRepository.save(availableSlot);
        
        // Lưu vé xuống database
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Log thông tin (nếu cần debug)
        System.out.println("✅ Check-in thành công: " + 
            "Vé #" + savedTicket.getId() + 
            ", Biển số: " + savedTicket.getLicensePlate() + 
            ", Slot: " + availableSlot.getSlotNumber() + 
            ", Zone: " + zone.getName());
        
        return savedTicket;
    }
    
    /**
     * Xử lý xuất bãi (Check-out)
     * 
     * @param ticketId ID của vé cần checkout
     * @return Ticket đã được xử lý
     */
    @Transactional
    public Ticket processExit(Long ticketId) {
        // Tìm vé theo ID
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vé với ID: " + ticketId));
        
        // Kiểm tra vé đã checkout chưa
        if (ticket.getStatus() == Ticket.Status.COMPLETED) {
            throw new InvalidRequestException("Vé này đã được thanh toán và xuất bãi rồi");
        }
        
        // Kiểm tra nếu vé chưa có giờ vào (trường hợp bất thường)
        if (ticket.getEntryTime() == null) {
            throw new InvalidRequestException("Vé không hợp lệ: không có thời gian vào");
        }
        
        // Set giờ ra
        LocalDateTime exitTime = LocalDateTime.now();
        ticket.setExitTime(exitTime);
        
        // Tính tiền gửi xe
        Double totalAmount = feeCalculationService.calculateFee(
            ticket.getEntryTime(), 
            exitTime, 
            ticket.getVehicleType()
        );
        ticket.setTotalAmount(totalAmount);
        
        // Cập nhật trạng thái vé
        ticket.setStatus(Ticket.Status.COMPLETED);
        
        // Cập nhật trạng thái slot về trống
        ParkingSlot slot = ticket.getSlot();
        if (slot != null) {
            slot.setStatus(ParkingSlot.Status.AVAILABLE);
            parkingSlotRepository.save(slot);
        }
        
        // Lưu lại thông tin vé
        return ticketRepository.save(ticket);
    }
    
    /**
     * Lấy tất cả vé
     */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    /**
     * Lấy vé theo ID
     */
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vé với ID: " + id));
    }
    
    /**
     * Lấy vé đang hoạt động theo biển số
     */
    public Ticket getActiveTicketByLicensePlate(String licensePlate) {
        return ticketRepository.findByLicensePlateAndStatus(licensePlate, Ticket.Status.ACTIVE)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vé đang hoạt động cho xe: " + licensePlate));
    }
    
    /**
     * Lấy tất cả vé đang hoạt động
     */
    public List<Ticket> getActiveTickets() {
        return ticketRepository.findByIdAndStatus(null, Ticket.Status.ACTIVE)
            .map(List::of)
            .orElseGet(List::of);
    }
}
