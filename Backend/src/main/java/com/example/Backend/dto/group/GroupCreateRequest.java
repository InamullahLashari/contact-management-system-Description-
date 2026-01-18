package com.example.Backend.dto.group;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class GroupCreateRequest {

    private String groupName;
    private String description;
    private Set<Long>  contactIds;
}
