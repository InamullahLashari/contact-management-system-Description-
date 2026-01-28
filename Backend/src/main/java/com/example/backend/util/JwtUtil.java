package com.example.backend.util;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {


    private  String secretKey="giNWBuwhsqJOxczFnDEhUFEThR3ZugEt2vDrg-fR5ro";
    private  long accessExpiry=10000 * 60 * 20;
    private  long refreshExpiry=1000 * 60 * 60 * 24 * 7;


    // Extract username (email in your case) from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract expiration date
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract custom claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);

    }
    public boolean isAccessToken(String token) {
        return "access".equals(extractClaim(token, c -> c.get("type", String.class)));
    }

    // Extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Check if token is expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Public method to generate access token (2 minutes)
    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "access");

        // Add user role(s) from UserDetails
        if (userDetails.getAuthorities() != null && !userDetails.getAuthorities().isEmpty()) {
            // Convert authorities to a simple string (or list if multiple roles)
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            claims.put("role", role);
        }

        return createToken(claims, userDetails.getUsername(), accessExpiry);
    }

    // Refresh token (7 days)
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createToken(claims, userDetails.getUsername(), refreshExpiry);
    }

    // Common token generator method
    private String createToken(Map<String, Object> claims, String subject, long expiry) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // Subject = username/email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiry))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    public String getTokenType(String token) {
        return extractAllClaims(token).get("type", String.class);
    }

    // Get signing key
    private Key getSignKey() {
        byte[] keyBytes = secretKey.getBytes();
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    // Validate token against UserDetails
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


}
