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

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        // 1. Tắt CSRF (Cross-Site Request Forgery)
        http.csrf((CsrfConfigurer<HttpSecurity> csrf) -> {
            csrf.disable();
        });

        // 2. Cấu hình phân quyền (Authorize Requests)
        http.authorizeHttpRequests((AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) -> {
            // Các quy tắc bảo mật
            auth.requestMatchers("/api/auth/**").permitAll();
            auth.requestMatchers("/api/reports/**").hasRole("ADMIN");
            auth.requestMatchers("/api/**").hasAnyRole("ADMIN", "EMPLOYEE");
            auth.requestMatchers("/**").authenticated();
        });

        // 3. Cấu hình HTTP Basic dùng cấu hình mặc định
        http.httpBasic((HttpBasicConfigurer<HttpSecurity> basic) -> {
        });

        return http.build();
    }
}
