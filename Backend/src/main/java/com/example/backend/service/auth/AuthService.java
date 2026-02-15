package com.example.backend.service.auth;

import com.example.backend.dto.login.LoginRequestDto;

import java.util.Map;

public interface AuthService {


    Map<String, Object> login(LoginRequestDto dto);


    void logout(String email);

    String refreshTokens(String refreshToken);

    void forgetPassword(String email);

    boolean isUserExist(String email);

    void verifyOtp(String email, String otp);

    void resetPasswordAfterOtp(String email, String newPassword, String confirmPassword);

    void resetPassword(String email, String oldPassword, String newPassword, String confirmPassword);

}

