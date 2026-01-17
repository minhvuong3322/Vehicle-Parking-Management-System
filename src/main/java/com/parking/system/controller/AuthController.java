package com.parking.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parking.system.dto.ApiResponse;
import com.parking.system.dto.RegisterRequest;
import com.parking.system.entity.User;
import com.parking.system.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    // Đăng ký tài khoản (Admin/Employee)
    // Username, Password, FullName, Role
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody @Valid RegisterRequest request) {
        try {
            User newUser = userService.createUser(
                request.getUsername(), 
                request.getPassword(), 
                request.getFullName(), 
                request.getRole()
            );
            return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", newUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi đăng ký: " + e.getMessage()));
        }
    }
    
    // Xem danh sách nhân viên (Dành cho Admin check)
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", users));
    }
}