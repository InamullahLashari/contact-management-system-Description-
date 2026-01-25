package com.example.Backend.dto.group;

import com.example.Backend.entity.contact.Contact;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GroupResponseDto {

    private Long id;
    private String groupName;
    private String description;
    private Set<Long> contactIds;
}
