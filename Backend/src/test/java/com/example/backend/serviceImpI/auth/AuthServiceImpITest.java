package com.example.backend.serviceImpI.auth;

import com.example.backend.dto.login.LoginRequestDto;
import com.example.backend.entity.auth.PasswordResetOtp;
import com.example.backend.entity.role.Role;
import com.example.backend.entity.roleEnum.RoleName;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.exception.PasswordMismatchException;
import com.example.backend.exception.PasswordReuseException;
import com.example.backend.repository.auth.PasswordResetOtpRepository;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.serviceImpI.customdetailImpl.CustomUserDetailsServiceImpl;
import com.example.backend.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthServiceImpITest {

    @InjectMocks
    private AuthServiceImpI authService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordResetOtpRepository otpRepository;
    @Mock
    private CustomUserDetailsServiceImpl customUserDetailsService;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private PasswordEncoder passwordEncoder;


    @Mock
    private JavaMailSender mailSender;

    private User user;
    private Role role;

    @BeforeEach
    void setup() {
        role = new Role();

        role = new Role(RoleName.ROLE_ADMIN);

        user = new User();
        user.setEmail("test@mail.com");
        user.setPassword("encodedPass");
        user.setRole(role);
        user.setDeleted(false);
    }

    // ================= LOGIN =================
    @Test
    void login_success() {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("test@mail.com");
        dto.setPassword("password");

        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPass")).thenReturn(true);
        when(customUserDetailsService.loadUserByUsername("test@mail.com")).thenReturn(mock(UserDetails.class));
        when(jwtUtil.generateAccessToken(any())).thenReturn("accessToken");
        when(jwtUtil.generateRefreshToken(any())).thenReturn("refreshToken");

        var result = authService.login(dto);

        assertEquals("success", result.get("status"));

        // Use the correct getter for your Role class
        assertEquals(user.getRole().getRoleName().name(), result.get("role")); // returns "ROLE_ADMIN"

        verify(userRepository).save(user);
    }


    @Test
    void login_userNotFound() {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("test@mail.com"); // <<< FIX: set email
        dto.setPassword("anyPassword");

        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> authService.login(dto));
    }


    @Test
    void login_invalidPassword() {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("test@mail.com"); // <<< FIX: set the email
        dto.setPassword("wrongPassword");

        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(InvalidActionException.class, () -> authService.login(dto));
    }

    // ================= LOGOUT =================
    @Test
    void logout_success() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        authService.logout("test@mail.com");
        assertNull(user.getRefreshToken());
        verify(userRepository).save(user);
    }

    @Test
    void logout_userNotFound() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> authService.logout("test@mail.com"));
    }

    // ================= isUserExist =================
    @Test
    void isUserExist_true() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        assertTrue(authService.isUserExist("test@mail.com"));
    }

    @Test
    void isUserExist_false() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.empty());
        assertFalse(authService.isUserExist("test@mail.com"));
    }

    // ================= FORGET PASSWORD =================
    @Test

    void forgetPassword_success() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        when(otpRepository.findByEmail("test@mail.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedOtp");

        authService.forgetPassword("test@mail.com");

        verify(otpRepository).save(any());
        verify(mailSender).send(any(org.springframework.mail.SimpleMailMessage.class)); // specify type
    }


    @Test
    void forgetPassword_userDeleted() {
        user.setDeleted(true);
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        assertThrows(InvalidActionException.class, () -> authService.forgetPassword("test@mail.com"));
    }

    @Test
    void forgetPassword_userNotFound() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> authService.forgetPassword("test@mail.com"));
    }

    // ================= VERIFY OTP =================
    @Test
    void verifyOtp_success() {
        PasswordResetOtp otp = new PasswordResetOtp();
        otp.setOtp("encodedOtp");
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otp.setUsed(false);

        when(otpRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(otp));
        when(passwordEncoder.matches("123456", "encodedOtp")).thenReturn(true);

        authService.verifyOtp("test@mail.com", "123456");

        assertTrue(otp.isUsed());
        verify(otpRepository).save(otp);
    }

    @Test
    void verifyOtp_invalidOtp() {
        when(otpRepository.findByEmail("test@mail.com")).thenReturn(Optional.empty());
        assertThrows(InvalidActionException.class, () -> authService.verifyOtp("test@mail.com", "123456"));
    }

    @Test
    void verifyOtp_expired() {
        PasswordResetOtp otp = new PasswordResetOtp();
        otp.setExpiryTime(LocalDateTime.now().minusMinutes(1));
        otp.setUsed(false);
        when(otpRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(otp));
        assertThrows(InvalidActionException.class, () -> authService.verifyOtp("test@mail.com", "123456"));
    }

    @Test
    void verifyOtp_alreadyUsed() {
        PasswordResetOtp otp = new PasswordResetOtp();
        otp.setUsed(true);
        when(otpRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(otp));
        assertThrows(InvalidActionException.class, () -> authService.verifyOtp("test@mail.com", "123456"));
    }

    // ================= RESET PASSWORD AFTER OTP =================
    @Test
    void resetPasswordAfterOtp_success() {
        PasswordResetOtp otp = new PasswordResetOtp();
        otp.setUsed(true);
        when(otpRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(otp));
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewPass@123")).thenReturn("encodedNew");

        try (MockedStatic<com.example.backend.serviceImpI.passwordvalidator.PasswordValidator> mockValidator =
                     mockStatic(com.example.backend.serviceImpI.passwordvalidator.PasswordValidator.class)) {
            mockValidator.when(() -> com.example.backend.serviceImpI.passwordvalidator.PasswordValidator.isStrongPassword("NewPass@123"))
                    .thenReturn(true);

            authService.resetPasswordAfterOtp("test@mail.com", "NewPass@123", "NewPass@123");
        }

        verify(userRepository).save(user);
        verify(otpRepository).delete(any());
    }

    @Test
    void resetPasswordAfterOtp_notVerified() {
        PasswordResetOtp otp = new PasswordResetOtp();
        otp.setUsed(false);
        when(otpRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(otp));
        assertThrows(InvalidActionException.class, () -> authService.resetPasswordAfterOtp("test@mail.com", "NewPass@123", "NewPass@123"));
    }

    // ================================= RESET PASSWORD =================
    @Test
    void resetPassword_success() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("oldPass", "encodedPass")).thenReturn(true);
        when(passwordEncoder.matches("NewPass@123", "encodedPass")).thenReturn(false);
        when(passwordEncoder.encode("NewPass@123")).thenReturn("encodedNew");

        try (MockedStatic<com.example.backend.serviceImpI.passwordvalidator.PasswordValidator> mockValidator =
                     mockStatic(com.example.backend.serviceImpI.passwordvalidator.PasswordValidator.class)) {
            mockValidator.when(() -> com.example.backend.serviceImpI.passwordvalidator.PasswordValidator.isStrongPassword("NewPass@123"))
                    .thenReturn(true);

            authService.resetPassword("test@mail.com", "oldPass", "NewPass@123", "NewPass@123");
        }

        verify(userRepository).save(user);
    }

    @Test
    void resetPassword_oldPasswordWrong() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongOld", "encodedPass")).thenReturn(false);
        assertThrows(InvalidActionException.class, () -> authService.resetPassword("test@mail.com", "wrongOld", "NewPass@123", "NewPass@123"));
    }

    @Test
    void resetPassword_mismatch() {
        // User ko email se find karne ka stub
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));

        // Old password check ka stub, taki method assume kare ke old password sahi hai
        when(passwordEncoder.matches("oldPass", user.getPassword())).thenReturn(true);


        // Test ke liye assert kehta hai ke agar new password aur confirm password mismatch ho, PasswordMismatchException throw ho
        assertThrows(PasswordMismatchException.class, () ->
                authService.resetPassword("test@mail.com", "oldPass", "NewPass1", "NewPass2")
        );
    }


    @Test
    void resetPassword_reuse() {
        when(userRepository.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));


        when(passwordEncoder.matches("oldPass", "encodedPass")).thenReturn(true);
        when(passwordEncoder.matches("NewPass@123", "encodedPass")).thenReturn(true);

        try (MockedStatic<com.example.backend.serviceImpI.passwordvalidator.PasswordValidator> mockValidator =
                     mockStatic(com.example.backend.serviceImpI.passwordvalidator.PasswordValidator.class)) {

            mockValidator.when(() -> com.example.backend.serviceImpI.passwordvalidator.PasswordValidator.isStrongPassword("NewPass@123"))
                    .thenReturn(true);

            // Now should correctly throw PasswordReuseException
            assertThrows(PasswordReuseException.class, () ->
                    authService.resetPassword("test@mail.com", "oldPass", "NewPass@123", "NewPass@123"));
        }
    }

}
