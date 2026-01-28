package com.example.backend.dto.phone;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhoneWithContactDto {
    private String firstName;     // contact first name
    private String phoneNumber;
    private String label;
}
