package com.example.Backend.dto.group;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
public class GroupResponseDto {

    private Long id;
    private String groupName;
    private String description;
    @NotBlank
    private Set<Long> phoneIds;
}
