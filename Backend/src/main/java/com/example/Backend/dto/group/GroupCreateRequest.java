package com.example.Backend.dto.group;

import lombok.Data;

import java.util.Set;

@Data
public class GroupCreateRequest {

    private String groupName;
    private String description;
    private Set<Long> phoneIds;
}
