package com.parking.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        // 1. Cấu hình CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        // 2. Tắt CSRF (Cross-Site Request Forgery)
        http.csrf((CsrfConfigurer<HttpSecurity> csrf) -> {
            csrf.disable();
        });

        // 3. Cấu hình phân quyền (Authorize Requests)
        http.authorizeHttpRequests((AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) -> {
            // Cho phép OPTIONS requests (preflight) không cần authentication
            auth.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll();
            // Các quy tắc bảo mật
            auth.requestMatchers("/api/auth/**").permitAll();
            auth.requestMatchers("/api/reports/**").hasRole("ADMIN");
            auth.requestMatchers("/api/**").hasAnyRole("ADMIN", "EMPLOYEE");
            auth.requestMatchers("/**").permitAll(); // Cho phép tất cả để frontend có thể truy cập
        });

        // 4. Cấu hình HTTP Basic dùng cấu hình mặc định
        http.httpBasic((HttpBasicConfigurer<HttpSecurity> basic) -> {
        });

        return http.build();
    }
}
