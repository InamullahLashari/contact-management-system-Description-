package com.example.Backend.controller.user;


import com.example.Backend.dto.user.UserRequestDto;
import com.example.Backend.entity.user.User;
import com.example.Backend.service.auth.AuthService;
import com.example.Backend.service.user.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {


    @Autowired
private UserService userService;





    @PostMapping("/signup")
    public ResponseEntity<?> signUpUser(@RequestBody @Valid UserRequestDto userRequestDto) {
        log.info("Sign-up attempt with data: {}", userRequestDto);

     // Map DTO to User entity
        User user = new User();
        user.setName(userRequestDto.getName());
        user.setEmail(userRequestDto.getEmail());
        user.setPassword(userRequestDto.getPassword()); // raw password, service will encode

        //  Call service to save user
        User savedUser = userService.signUpUser(user);

        // 3 Prepare response
        Map<String, Object> response = Map.of(
                "status", "success",
                "message", "User registered successfully",
                "userId", savedUser.getId(),
                "email", savedUser.getEmail()
        );

        log.info("Sign-up successful for email: {}", savedUser.getEmail());

        return ResponseEntity.ok(response);
    }






}
