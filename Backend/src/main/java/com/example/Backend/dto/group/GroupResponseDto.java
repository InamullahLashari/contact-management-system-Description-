package com.example.Backend.dto.group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
