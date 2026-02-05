package com.example.backend.controller.auth;


import com.example.backend.dto.login.LoginRequestDto;
import com.example.backend.exception.PasswordMismatchException;
import com.example.backend.exception.UnauthorizedActionException;
import com.example.backend.service.auth.AuthService;
import com.example.backend.util.AuthenticationUtil;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private AuthenticationUtil authUtil;


    //==================================User Login================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDto dto) {
        log.trace("Entering login() with DTO: {}", dto);
        // Delegate to service for business logic
        Map<String, Object> response = authService.login(dto);

        log.info("Login successful for email: {}", dto.getEmail());
        log.trace("Exiting login() for email: {}", dto.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgetPassword(@RequestParam String email) {
        authService.forgetPassword(email);
        return ResponseEntity.ok("User verified. Please enter old and new password.");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String newPassword,
            @RequestParam String confirmPassword) {

        if (!newPassword.equals(confirmPassword)) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        authService.resetPassword(email, newPassword, confirmPassword);
        log.info("Reset password for email: {}", email);

        return ResponseEntity.ok("New password successfully set");
    }


    //===================logout==================================
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        log.trace("Entering logout");

        String email = authUtil.getEmail();

        if (email == null) {
            log.warn("Logout failed: No authenticated user.");
            throw new UnauthorizedActionException("Unauthorized: No valid token provided.");
        }

        authService.logout(email);
        System.out.println("me logout bro: " + email);
        log.info("Logout successful for email: {}", email);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Logged out successfully"
        ));
    }

}










































