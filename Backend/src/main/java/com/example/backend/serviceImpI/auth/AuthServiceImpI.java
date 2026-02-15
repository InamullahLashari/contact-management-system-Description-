package com.example.backend.serviceImpI.auth;

import com.example.backend.dto.login.LoginRequestDto;
import com.example.backend.entity.auth.PasswordResetOtp;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.exception.PasswordMismatchException;
import com.example.backend.exception.PasswordReuseException;
import com.example.backend.repository.auth.PasswordResetOtpRepository;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.service.auth.AuthService;
import com.example.backend.serviceImpI.customdetailImpl.CustomUserDetailsServiceImpl;
import com.example.backend.serviceImpI.passwordvalidator.PasswordValidator;
import com.example.backend.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;


@Service
public class AuthServiceImpI implements AuthService {


    private final UserRepository userRepository;
    private final CustomUserDetailsServiceImpl customUserDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private PasswordResetOtpRepository otpRepository;
    @Autowired
    private JavaMailSender mailSender;


    public AuthServiceImpI(UserRepository userRepository,
                           CustomUserDetailsServiceImpl customUserDetailsService,
                           JwtUtil jwtUtil,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Map<String, Object> login(LoginRequestDto dto) {

        String email = dto.getEmail();
        String password = dto.getPassword();


        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));


        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidActionException("Invalid password");
        }
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);


        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);


        user.setRefreshToken(refreshToken);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);


        String roleType = user.getRole().getRoleName().name(); // set roleType from user
        Map<String, String> tokens = new LinkedHashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("message", roleType + " login successful");
        response.put("role", roleType);
        response.put("tokens", tokens);

        return response;
    }

    @Override
    public void logout(String email) {
        // Optional: clear refresh token
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    @Override
    public String refreshTokens(String refreshToken) {
        // Implement refresh token logic
        return "";
    }

    //=========================user chcek========================//

    @Override
    public boolean isUserExist(String email) {
        return userRepository.findByEmailIgnoreCase(email).isPresent();
    }


    //=============================generateResetPasswordToken=======================//
    @Transactional
    @Override
    public void forgetPassword(String email) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.isDeleted()) {
            throw new InvalidActionException("User has been deleted");
        }

        // Generate OTP
        String generatedOtp = generateOtp();

        // Find existing OTP or create new
        PasswordResetOtp otpEntity = otpRepository.findByEmail(email)
                .orElse(new PasswordResetOtp());

        otpEntity.setEmail(email);
        otpEntity.setOtp(passwordEncoder.encode(generatedOtp));
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false); // mark as not used yet

        otpRepository.save(otpEntity);

        sendOtpEmail(email, generatedOtp);
    }


    //=====================================verify otp========================================================
    @Transactional
    @Override
    public void verifyOtp(String email, String otp) {

        PasswordResetOtp otpEntity = otpRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidActionException("Invalid OTP"));

        // Check if OTP is already used
        if (otpEntity.isUsed()) {
            throw new InvalidActionException("OTP already used or verified");
        }

        // Check expiry
        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new InvalidActionException("OTP expired");
        }

        // Check OTP match
        if (!passwordEncoder.matches(otp, otpEntity.getOtp())) {
            throw new InvalidActionException("Invalid OTP");
        }

        // Mark OTP as verified (used=true)
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);
    }

    //==========================resetpassword
    @Transactional
    @Override
    public void resetPasswordAfterOtp(String email, String newPassword, String confirmPassword) {

        PasswordResetOtp otpEntity = otpRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidActionException("OTP not verified"));

        if (!otpEntity.isUsed()) {
            throw new InvalidActionException("OTP has not been verified");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        if (!PasswordValidator.isStrongPassword(newPassword)) {
            throw new InvalidActionException("Password must be 8+ chars with upper/lower/digit/special char");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpRepository.delete(otpEntity); // remove OTP after successful reset
    }


//=======================reset password============================

    @Override
    public void resetPassword(String email, String oldPassword, String newPassword, String confirmPassword) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new InvalidActionException("Old password is incorrect");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        if (!PasswordValidator.isStrongPassword(newPassword)) {
            throw new InvalidActionException("Password must be 8+ chars with upper/lower/digit/special char");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new PasswordReuseException("New password must be different from the old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }





    //=====================helper function =====/////////

    private String generateOtp() {
        return String.valueOf(100000 + new java.security.SecureRandom().nextInt(900000));
    }
    private void sendOtpEmail(String email, String otp) {

        org.springframework.mail.SimpleMailMessage message =
                new org.springframework.mail.SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP is: " + otp + ". It is valid for 5 minutes.");

        mailSender.send(message);
    }


}
