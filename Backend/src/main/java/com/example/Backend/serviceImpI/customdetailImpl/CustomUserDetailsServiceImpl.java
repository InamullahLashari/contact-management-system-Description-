package com.example.Backend.serviceImpl.customdetailImpl;

import com.example.Backend.entity.user.User;
import com.example.Backend.repository.user.UserRepository;
import com.example.Backend.service.customdetail.CustomUserDetailsService;
import com.example.Backend.util.CustomUserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + username
                ));

        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole().getRoleName().name()))
        );
    }
}