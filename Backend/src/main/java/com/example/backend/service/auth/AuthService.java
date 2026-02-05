package com.example.backend.service.auth;

import com.example.backend.dto.login.LoginRequestDto;

import java.util.Map;

public interface AuthService {


    Map<String, Object> login(LoginRequestDto dto);


    void logout(String email);

    String refreshTokens(String refreshToken);

    void forgetPassword(String email);

    void resetPassword(String email, String newPassword, String confirmPassword);


}

