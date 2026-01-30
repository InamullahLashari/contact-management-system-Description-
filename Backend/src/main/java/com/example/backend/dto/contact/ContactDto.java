package com.example.backend.dto.contact;

import com.example.backend.dto.email.ContactEmailDto;
import com.example.backend.dto.phone.ContactPhoneDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ContactDto {


    private Long id;
    private String firstName;
    private String lastName;
    private String title;
    private List<ContactEmailDto> emails;
    private List<ContactPhoneDto> phones;
//    private Set<String> groups;


}
