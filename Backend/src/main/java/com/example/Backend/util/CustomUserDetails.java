package com.example.Backend.util;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

public class CustomUserDetails implements UserDetails {

        private final Long userId;
        private final String email;
        private final String password;
        private final List<GrantedAuthority> authorities;

        public CustomUserDetails(
                Long userId,
                String email,
                String password,
                List<GrantedAuthority> authorities) {

            this.userId = userId;
            this.email = email;
            this.password = password;
            this.authorities = authorities;
        }

        public Long getUserId() {
            return userId;
        }

        @Override public String getUsername() { return email; }
        @Override public String getPassword() { return password; }
        @Override public List<GrantedAuthority> getAuthorities() { return authorities; }

        @Override public boolean isAccountNonExpired() { return true; }
        @Override public boolean isAccountNonLocked() { return true; }
        @Override public boolean isCredentialsNonExpired() { return true; }
        @Override public boolean isEnabled() { return true; }


}
