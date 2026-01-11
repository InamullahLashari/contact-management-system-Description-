package com.example.Backend.util;

import com.example.Backend.service.customdetail.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JWTFilter extends OncePerRequestFilter {


    @Autowired
    private final CustomUserDetailsService customUserDetailsServic;
    @Autowired
     private final JwtUtil jwtUtil;

    public JWTFilter(CustomUserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.customUserDetailsServic = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/user/signup") || path.equals("/auth/login") || path.equals("/auth/refresh");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null &&
                    jwtUtil.isAccessToken(token)) {

                // Extract role from JWT claims
                String role = jwtUtil.extractClaim(token, c -> c.get("role", String.class));
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                if (role != null) {
                    authorities.add(new SimpleGrantedAuthority(role));
                }

                CustomUserDetails customUserDetails = new CustomUserDetails(
                        0L,
                        username,
                        "",
                        authorities
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                customUserDetails,
                                null,
                                customUserDetails.getAuthorities()
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
