package com.example.Backend.dto.user;


import lombok.Data;

@Data
public class UserRequestDto {


    private String name;
    private String email;
    private String password;
}
