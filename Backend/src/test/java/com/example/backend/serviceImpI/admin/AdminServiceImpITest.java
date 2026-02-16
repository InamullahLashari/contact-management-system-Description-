package com.example.backend.serviceImpI.admin;


import com.example.backend.dto.admin.UserResponseAdmin;
import com.example.backend.entity.role.Role;
import com.example.backend.entity.roleEnum.RoleName;
import com.example.backend.entity.user.User;
import com.example.backend.mapper.admin.AdminMapper;
import com.example.backend.repository.admin.AdminRepository;
import com.example.backend.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImpITest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdminMapper adminMapper;

    @InjectMocks
    private AdminServiceImpI adminService;

    private User admin;
    private User normalUser;
    private Role adminRole;
    private Role userRole;

    @BeforeEach
    void setUp() {
        adminRole = new Role();
        adminRole.setRoleName(RoleName.ROLE_ADMIN);

        userRole = new Role();
        userRole.setRoleName(RoleName.ROLE_USER);

        admin = new User();
        admin.setEmail("admin@test.com");
        admin.setRole(adminRole);

        normalUser = new User();
        normalUser.setEmail("user@test.com");
        normalUser.setRole(userRole);
        normalUser.setDeleted(false);
    }

    // ===================== USER LIST =====================

    @Test
    void userList_shouldReturnUsers_whenAdmin() {
        PageRequest pageRequest = PageRequest.of(0, 5);

        when(userRepository.findByEmailIgnoreCase("admin@test.com"))
                .thenReturn(Optional.of(admin));

        Page<User> userPage = new PageImpl<>(List.of(normalUser));
        when(adminRepository.findByRole_RoleNameAndDeletedFalse(RoleName.ROLE_USER, pageRequest))
                .thenReturn(userPage);

        when(adminMapper.toUserResponseAdmin(normalUser))
                .thenReturn(new UserResponseAdmin());

        Page<UserResponseAdmin> result =
                adminService.UserList("admin@test.com", pageRequest, null);

        assertEquals(1, result.getTotalElements());
        verify(adminRepository, times(1))
                .findByRole_RoleNameAndDeletedFalse(RoleName.ROLE_USER, pageRequest);
    }

    @Test
    void userList_shouldThrowException_whenNotAdmin() {
        normalUser.setRole(userRole);

        when(userRepository.findByEmailIgnoreCase("user@test.com"))
                .thenReturn(Optional.of(normalUser));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                adminService.UserList("user@test.com",
                        PageRequest.of(0, 5), null));

        assertEquals("Access denied: Not an admin", exception.getMessage());
    }

    @Test
    void userList_shouldSearchUsers_whenSearchProvided() {
        PageRequest pageRequest = PageRequest.of(0, 5);

        when(userRepository.findByEmailIgnoreCase("admin@test.com"))
                .thenReturn(Optional.of(admin));

        Page<User> userPage = new PageImpl<>(List.of(normalUser));
        when(adminRepository
                .findByRole_RoleNameAndNameContainingIgnoreCaseAndDeletedFalse(
                        RoleName.ROLE_USER, "john", pageRequest))
                .thenReturn(userPage);

        when(adminMapper.toUserResponseAdmin(normalUser))
                .thenReturn(new UserResponseAdmin());

        Page<UserResponseAdmin> result =
                adminService.UserList("admin@test.com", pageRequest, "john");

        assertEquals(1, result.getTotalElements());
    }

    // ===================== DELETE USER =====================

    @Test
    void deleteUser_shouldDeleteSuccessfully() {
        when(userRepository.findByEmailIgnoreCase("admin@test.com"))
                .thenReturn(Optional.of(admin));

        when(userRepository.findByEmailIgnoreCase("user@test.com"))
                .thenReturn(Optional.of(normalUser));

        boolean result =
                adminService.deleteUser("admin@test.com", "user@test.com");

        assertTrue(result);
        assertTrue(normalUser.isDeleted());
        verify(userRepository, times(1)).save(normalUser);
    }

    @Test
    void deleteUser_shouldThrowException_whenAdminDeletesHimself() {
        when(userRepository.findByEmailIgnoreCase("admin@test.com"))
                .thenReturn(Optional.of(admin));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                adminService.deleteUser("admin@test.com", "admin@test.com"));

        assertEquals("Admin cannot delete himself", exception.getMessage());
    }

    @Test
    void deleteUser_shouldThrowException_whenUserAlreadyDeleted() {
        normalUser.setDeleted(true);

        when(userRepository.findByEmailIgnoreCase("admin@test.com"))
                .thenReturn(Optional.of(admin));

        when(userRepository.findByEmailIgnoreCase("user@test.com"))
                .thenReturn(Optional.of(normalUser));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                adminService.deleteUser("admin@test.com", "user@test.com"));

        assertEquals("Access denied: User already deleted", exception.getMessage());
    }

    @Test
    void deleteUser_shouldThrowException_whenNotAdmin() {
        when(userRepository.findByEmailIgnoreCase("user@test.com"))
                .thenReturn(Optional.of(normalUser));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                adminService.deleteUser("user@test.com", "another@test.com"));

        assertEquals("Access denied: Only admin can delete users",
                exception.getMessage());
    }

    @Test
    void getUser_shouldThrowException_whenNotFound() {
        when(userRepository.findByEmailIgnoreCase("missing@test.com"))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                adminService.UserList("missing@test.com",
                        PageRequest.of(0, 5), null));
    }
}
