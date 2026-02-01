package com.example.backend.mapper.admin;

import com.example.backend.dto.admin.UserResponseAdmin;
import com.example.backend.entity.user.User;
import org.springframework.stereotype.Component;

@Component
public class AdminMapper {

    public UserResponseAdmin toUserResponseAdmin(User user) {
        if (user == null) return null;

        return new UserResponseAdmin(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getRoleName()
        );
    }
}
