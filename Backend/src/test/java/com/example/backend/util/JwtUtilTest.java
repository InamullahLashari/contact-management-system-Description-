package com.example.backend.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {

        jwtUtil = new JwtUtil();
        userDetails = new User("test@example.com", "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void testGenerateAccessTokenAndValidate() {
        String token = jwtUtil.generateAccessToken(userDetails);
        assertNotNull(token);

        assertEquals("access", jwtUtil.getTokenType(token));
        assertEquals(userDetails.getUsername(), jwtUtil.extractUsername(token));
        assertTrue(jwtUtil.validateToken(token, userDetails));
    }

    @Test
    void testGenerateRefreshTokenAndValidate() {
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);
        assertNotNull(refreshToken);

        assertEquals("refresh", jwtUtil.getTokenType(refreshToken));
        assertEquals(userDetails.getUsername(), jwtUtil.extractUsername(refreshToken));
        assertTrue(jwtUtil.validateToken(refreshToken, userDetails));
    }

    @Test
    void testTokenExpiration() throws InterruptedException {

        jwtUtil = new JwtUtil(2000, 2000); // 2 sec expiry

        String token = jwtUtil.generateAccessToken(userDetails);

        // Token should be valid immediately
        assertTrue(jwtUtil.validateToken(token, userDetails));

        // Wait until token expires
        Thread.sleep(2200);


        try {
            jwtUtil.validateToken(token, userDetails);
            fail("Expected token to be expired and validation to fail");
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // Test passes
        }
    }
}
