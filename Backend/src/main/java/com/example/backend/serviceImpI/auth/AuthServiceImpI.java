package com.example.backend.serviceImpI.auth;

import com.example.backend.dto.login.LoginRequestDto;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.exception.PasswordReuseException;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.service.auth.AuthService;
import com.example.backend.serviceImpI.customdetailImpl.CustomUserDetailsServiceImpl;
import com.example.backend.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
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

    //=============================generateResetPasswordToken=======================//
    @Override
    public void forgetPassword(String email) {

        User user = userRepository.findByEmailIgnoreCase(email).
                orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.isDeleted()) {
            throw new InvalidActionException("User has been deleted");
        }



    }


    @Override
    public void resetPassword(String email, String newPassword, String confirmPassword) {

        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(
                () -> new EntityNotFoundException("User not found")
        );

        if (user.isDeleted()) {

            throw new InvalidActionException("User has been deleted");

        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new PasswordReuseException("New password must be different from the old password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

    }
}
