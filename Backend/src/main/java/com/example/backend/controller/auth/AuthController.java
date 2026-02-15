package com.example.backend.controller.auth;


import com.example.backend.dto.login.LoginRequestDto;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.exception.PasswordMismatchException;
import com.example.backend.exception.UnauthorizedActionException;
import com.example.backend.service.auth.AuthService;
import com.example.backend.util.AuthenticationUtil;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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




    //=======================Forgot Password: Send OTP==============================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            boolean userExists = authService.isUserExist(email);
            if (!userExists) {
                // Do not reveal whether email exists for security
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", " OTP has been sent."
                ));
            }

            authService.forgetPassword(email); // generate & send OTP
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "OTP sent to your email."
            ));

        } catch (Exception ex) {
            log.error("Error sending OTP to {}: {}", email, ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "Failed to send OTP. Please try again later."
            ));
        }
    }



//======================otp verify===================================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        try {
            authService.verifyOtp(email, otp);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "OTP verified. Proceed to reset password."
            ));
        } catch (InvalidActionException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "error",
                    "message", ex.getMessage()
            ));
        } catch (Exception ex) {
            log.error("Error verifying OTP for {}: {}", email, ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "Internal error while verifying OTP"
            ));
        }
    }


    //=======================otp end points==============================
    @PostMapping("/reset-password-otp")
    public ResponseEntity<?> resetPasswordAfterOtp(
            @RequestParam String email,
            @RequestParam String newPassword,
            @RequestParam String confirmPassword) {

        try {
            authService.resetPasswordAfterOtp(email, newPassword, confirmPassword);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Password reset successful"
            ));

        } catch (PasswordMismatchException | InvalidActionException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "error",
                    "message", ex.getMessage()
            ));
        } catch (Exception ex) {
            log.error("Error resetting password for {}: {}", email, ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "Internal error while resetting password"
            ));
        }
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

        log.info("Logout successful for email: {}", email);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Logged out successfully"
        ));
    }


    //=============================reseet pass===================================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            @RequestParam String confirmPassword) {

        String email = authUtil.getEmail();
        if (email == null) {
            throw new UnauthorizedActionException("Unauthorized: No valid user session.");
        }

        authService.resetPassword(email, oldPassword, newPassword, confirmPassword);

        log.info("Password successfully changed for user: {}", email);
        return ResponseEntity.ok("Password successfully updated");
    }

}










































