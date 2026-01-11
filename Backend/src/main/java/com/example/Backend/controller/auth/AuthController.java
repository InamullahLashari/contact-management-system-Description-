package com.example.Backend.controller.auth;


import com.example.Backend.dto.login.LoginRequestDto;
import com.example.Backend.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    private AuthService authService;
        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDto dto) {
        log.trace("Entering login() with DTO: {}", dto);
        log.info("Login attempt for email: {}", dto.getEmail());

        // Delegate to service for business logic
        Map<String, Object> response = authService.login(dto);

        log.info("Login successful for email: {}", dto.getEmail());
        log.trace("Exiting login() for email: {}", dto.getEmail());

        return ResponseEntity.ok(response);
    }


    }
































