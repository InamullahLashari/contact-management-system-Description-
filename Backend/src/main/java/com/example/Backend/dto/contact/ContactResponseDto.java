package com.example.Backend.dto.contact;
import com.example.Backend.dto.email.ContactEmailResponseDto;
import com.example.Backend.dto.phone.ContactPhoneResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponseDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String title;

    private Long userId; // Only the ID of the user who owns the contact

    private List<ContactEmailResponseDto> emails;
    private List<ContactPhoneResponseDto> phones;
    private Set<Long> groupIds;
}
