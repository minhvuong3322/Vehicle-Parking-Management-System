package com.parking.system.exception;

/**
 * Custom exception cho các request không hợp lệ
 * Ví dụ: thiếu field bắt buộc, sai format, giá trị không hợp lệ
 * Sẽ được GlobalExceptionHandler xử lý và trả về HTTP 400 BAD_REQUEST
 */
public class InvalidRequestException extends RuntimeException {
    
    /**
     * Constructor với message mô tả lỗi
     * @param message Mô tả chi tiết lỗi (ví dụ: "Trường 'status' là bắt buộc")
     */
    public InvalidRequestException(String message) {
        super(message);
    }
}
