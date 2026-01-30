package com.example.backend.dto.user;

import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.group.Group;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long id;
    private String name;
    private String email;
    private boolean active;
    private boolean verified;
    private String roleName;
    private List<Contact> contacts;
    private List<Group> groups;
}









