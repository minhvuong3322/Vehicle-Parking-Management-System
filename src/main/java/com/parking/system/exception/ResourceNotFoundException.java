package com.parking.system.exception;

/**
 * Custom exception cho trường hợp không tìm thấy resource
 * Ví dụ: Zone không tồn tại, Slot không tồn tại, User không tìm thấy
 * Sẽ được GlobalExceptionHandler xử lý và trả về HTTP 404 NOT_FOUND
 */
public class ResourceNotFoundException extends RuntimeException {
    
    /**
     * Constructor với message mô tả resource không tìm thấy
     * @param message Mô tả chi tiết (ví dụ: "Zone không tồn tại với ID: 123")
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
