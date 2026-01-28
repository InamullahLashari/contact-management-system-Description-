package com.example.backend.dto.phone;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContactPhoneResponseDto {
    private long id;
    private String phoneNumber;
    private String label;
}
