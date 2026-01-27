package com.example.Backend.controller.user;


import com.example.Backend.dto.user.UserRequestDto;
import com.example.Backend.entity.user.User;
import com.example.Backend.mapper.user.UserMapper;
import com.example.Backend.service.user.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {


    @Autowired
private UserService userService;




//=================================User SignUp=============================================//
    @PostMapping("/signup")
    public ResponseEntity<?> signUpUser(@RequestBody @Valid UserRequestDto userRequestDto) {
        log.info("Sign-up attempt with data: {}", userRequestDto);


        User savedUser = userService.signUpUser(UserMapper.toEntity(userRequestDto));
        log.info("Sign-up successful for email: {}", savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "success",
                "message", "User added successfully",
                "user", UserMapper.ToDto(savedUser)
        ));


    }

    @GetMapping("/hello")
    public ResponseEntity<?> hello() {
        return ResponseEntity.ok("Hello! User controller is working.");
    }





}
