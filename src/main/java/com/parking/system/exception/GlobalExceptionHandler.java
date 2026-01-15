package com.parking.system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.parking.system.dto.ApiResponse;

/**
 * Global Exception Handler - Xử lý tập trung tất cả exceptions trong ứng dụng
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // Xử lý exception khi không tìm thấy resource (Zone, Slot, etc.)
    // Trả về HTTP 404 NOT_FOUND
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    // Xử lý exception khi request không hợp lệ (thiếu field, sai format, etc.)
    // Trả về HTTP 400 BAD_REQUEST
    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidRequest(InvalidRequestException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    // Xử lý IllegalArgumentException (ví dụ: enum không hợp lệ)
    // Trả về HTTP 400 BAD_REQUEST
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }
    
    // Xử lý tất cả exceptions chưa được handle cụ thể
    // Trả về HTTP 500 INTERNAL_SERVER_ERROR
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Lỗi hệ thống: " + ex.getMessage()));
    }
}
