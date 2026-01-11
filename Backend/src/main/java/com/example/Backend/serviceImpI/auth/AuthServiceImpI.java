package com.example.Backend.serviceImpI.auth;

import com.example.Backend.dto.login.LoginRequestDto;
import com.example.Backend.entity.user.User;
import com.example.Backend.exception.InvalidActionException;
import com.example.Backend.repository.user.UserRepository;
import com.example.Backend.service.auth.AuthService;

import com.example.Backend.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AuthServiceImpI implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.Backend.serviceImpl.customdetailImpl.CustomUserDetailsServiceImpl customUserDetailsService;



    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

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


        String roleType = user.getRole().getRoleName(); // set roleType from user
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

    @Override
    public void generateResetPasswordToken(String email) {
        // Implement reset password token generation
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        // Implement password reset using token
    }
}
