package com.example.Backend.dto.email;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContactEmailResponseDto {
    private long id;
    private String emailAddress;
    private String label;
}
