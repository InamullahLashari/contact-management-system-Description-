package com.example.backend.controller.auth;



import com.example.backend.dto.login.LoginRequestDto;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.exception.PasswordMismatchException;

import com.example.backend.exception.UnauthorizedActionException;
import com.example.backend.service.auth.AuthService;
import com.example.backend.util.AuthenticationUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthService authService;

    @Mock
    private AuthenticationUtil authUtil;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    // =============================LOGIN TEST=============================

    @Test
    void login_shouldReturnSuccess() throws Exception {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("test@mail.com");
        dto.setPassword("password");

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("token", "mocked-jwt-token");

        when(authService.login(Mockito.any(LoginRequestDto.class))).thenReturn(responseMap);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"));
    }

    // =============================FORGOT PASSWORD TEST=============================

    @Test
    void forgotPassword_shouldSendOtp() throws Exception {
        String email = "test@mail.com";

        when(authService.isUserExist(email)).thenReturn(true);
        doNothing().when(authService).forgetPassword(email);

        mockMvc.perform(post("/auth/forgot-password")
                        .param("email", email))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("OTP sent to your email."));
    }

    // =============================VERIFY OTP TEST=============================

    @Test
    void verifyOtp_shouldReturnSuccess() throws Exception {
        String email = "test@mail.com";
        String otp = "123456";

        doNothing().when(authService).verifyOtp(email, otp);

        mockMvc.perform(post("/auth/verify-otp")
                        .param("email", email)
                        .param("otp", otp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("OTP verified. Proceed to reset password."));
    }

    @Test
    void verifyOtp_shouldReturnBadRequestOnInvalidOtp() throws Exception {
        String email = "test@mail.com";
        String otp = "wrong";

        doThrow(new InvalidActionException("Invalid OTP"))
                .when(authService).verifyOtp(email, otp);

        mockMvc.perform(post("/auth/verify-otp")
                        .param("email", email)
                        .param("otp", otp))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Invalid OTP"));
    }

    // =============================RESET PASSWORD AFTER OTP TEST==================

    @Test
    void resetPasswordAfterOtp_shouldReturnSuccess() throws Exception {
        String email = "test@mail.com";

        doNothing().when(authService).resetPasswordAfterOtp(email, "newPass", "newPass");

        mockMvc.perform(post("/auth/reset-password-otp")
                        .param("email", email)
                        .param("newPassword", "newPass")
                        .param("confirmPassword", "newPass"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Password reset successful"));
    }

    @Test
    void resetPasswordAfterOtp_shouldReturnBadRequestOnMismatch() throws Exception {
        String email = "test@mail.com";

        doThrow(new PasswordMismatchException("Passwords do not match"))
                .when(authService).resetPasswordAfterOtp(email, "newPass", "wrongConfirm");

        mockMvc.perform(post("/auth/reset-password-otp")
                        .param("email", email)
                        .param("newPassword", "newPass")
                        .param("confirmPassword", "wrongConfirm"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Passwords do not match"));
    }

    // =============================LOGOUT TEST=============================

    @Test
    void logout_shouldReturnSuccess() throws Exception {
        String email = "test@mail.com";
        when(authUtil.getEmail()).thenReturn(email);
        doNothing().when(authService).logout(email);

        mockMvc.perform(post("/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }

    @Test
    void logout_shouldThrowUnauthorized() {
        // Arrange: Simulate no authenticated user
        when(authUtil.getEmail()).thenReturn(null);

        // Act & Assert: Expect UnauthorizedActionException
        assertThrows(UnauthorizedActionException.class, () -> {
            authController.logout();
        });
    }

    // =============================RESET PASSWORD TEST=============================

    @Test
    void resetPassword_shouldReturnSuccess() throws Exception {
        String email = "test@mail.com";
        when(authUtil.getEmail()).thenReturn(email);
        doNothing().when(authService).resetPassword(email, "oldPass", "newPass", "newPass");

        mockMvc.perform(post("/auth/reset-password")
                        .param("oldPassword", "oldPass")
                        .param("newPassword", "newPass")
                        .param("confirmPassword", "newPass"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password successfully updated"));
    }

   

}
