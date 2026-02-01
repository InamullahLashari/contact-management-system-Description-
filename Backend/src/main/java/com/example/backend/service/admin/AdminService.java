package com.example.backend.service.admin;

import com.example.backend.dto.admin.UserResponseAdmin;
import com.example.backend.dto.user.UserResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface AdminService {

    Page<UserResponseAdmin> UserList(String email, PageRequest pageRequest, String search);

    boolean deleteUser(String authEmail, String email);
}
