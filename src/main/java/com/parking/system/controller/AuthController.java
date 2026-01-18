package com.parking.system.controller;

import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parking.system.dto.ApiResponse;
import com.parking.system.dto.LoginRequest;
import com.parking.system.dto.LoginResponse;
import com.parking.system.dto.RegisterRequest;
import com.parking.system.entity.User;
import com.parking.system.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Validate dữ liệu đầu vào
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Tên đăng nhập không được để trống"));
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Mật khẩu không được để trống"));
            }
            
            // Xác thực user
            User user = userService.authenticate(request.getUsername(), request.getPassword());
            
            // Tạo token đơn giản (Base64 encode của username:password)
            // Trong production, nên dùng JWT token
            String token = Base64.getEncoder().encodeToString(
                (request.getUsername() + ":" + request.getPassword()).getBytes()
            );
            
            // Tạo response (ẩn password)
            User userResponse = new User();
            userResponse.setId(user.getId());
            userResponse.setUsername(user.getUsername());
            userResponse.setFullName(user.getFullName());
            userResponse.setRole(user.getRole());
            userResponse.setActive(user.getActive());
            // Không set password
            
            LoginResponse loginResponse = new LoginResponse(token, userResponse, "Đăng nhập thành công");
            
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi để debug
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Tên đăng nhập hoặc mật khẩu không đúng"));
        }
    }
    
    // Đăng ký tài khoản (Admin/Employee)
    // Username, Password, FullName, Role
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody @Valid RegisterRequest request) {
        try {
            // Nếu không có role hoặc role == null, mặc định là EMPLOYEE
            User.Role userRole = (request.getRole() != null) ? request.getRole() : User.Role.EMPLOYEE;
            
            User newUser = userService.createUser(
                request.getUsername(), 
                request.getPassword(), 
                request.getFullName(), 
                userRole
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