package com.example.Backend.dto.user;
import com.example.Backend.entity.group.Group;
import com.example.Backend.entity.contact.Contact;
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









