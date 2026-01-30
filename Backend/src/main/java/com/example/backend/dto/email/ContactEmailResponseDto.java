package com.example.backend.dto.email;

import lombok.Data;

@Data

public class ContactEmailResponseDto {
    private long id;
    private String emailAddress;
    private String label;
}
