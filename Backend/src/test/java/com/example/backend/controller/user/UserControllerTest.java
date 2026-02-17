package com.example.backend.controller.user;

import com.example.backend.dto.user.UserRequestDto;
import com.example.backend.entity.role.Role;
import com.example.backend.entity.roleEnum.RoleName;
import com.example.backend.entity.user.User;
import com.example.backend.service.user.UserService;
import com.example.backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerSignupTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;


    @MockitoBean
    private JwtUtil jwtUtil;

    @Test
    void signUp_shouldReturn201_whenValidRequest() throws Exception {

        // Request
        UserRequestDto request = new UserRequestDto();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("Password@123");

        // Mocked service response
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("John Doe");
        savedUser.setEmail("john@example.com");

        Role role = new Role();
        role.setRoleName(RoleName.ROLE_USER);
        savedUser.setRole(role);

        when(userService.signUpUser(any(User.class)))
                .thenReturn(savedUser);

        mockMvc.perform(post("/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("User added successfully"))
                .andExpect(jsonPath("$.user.email").value("john@example.com"))
                .andExpect(jsonPath("$.user.roleName").value("ROLE_USER"));

    }
    @Test
    void signUp_shouldReturn400_whenInvalidEmail() throws Exception {

        UserRequestDto request = new UserRequestDto();
        request.setName("John Doe");
        request.setEmail("invalid-email");
        request.setPassword("Password@123");

        mockMvc.perform(post("/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
