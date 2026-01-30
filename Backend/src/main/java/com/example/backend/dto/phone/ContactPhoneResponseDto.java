package com.example.backend.dto.phone;

import lombok.Data;

@Data
public class ContactPhoneResponseDto {
    private long id;
    private String phoneNumber;
    private String label;
}
