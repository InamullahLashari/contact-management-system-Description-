package com.example.Backend.service.auth;

import com.example.Backend.dto.login.LoginRequestDto;

import java.util.Map;

public interface AuthService {


    Map<String, Object> login(LoginRequestDto dto);


    void logout(String email);


    String refreshTokens(String refreshToken);

    void generateResetPasswordToken(String email);

    void resetPassword(String token, String newPassword);

}

