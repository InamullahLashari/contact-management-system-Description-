package com.example.Backend.dto.group;

import com.example.Backend.entity.contact.Contact;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
public class GroupResponseDto {

    private Long id;
    private String groupName;
    private String description;
    private Set<Long>  contactIds;
}
