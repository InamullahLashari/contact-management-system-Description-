package com.example.Backend.dto.group;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ListGroupResponse {

    Long id;
    String description;
    String groupName;
    private Set<String> contactFirstNames;


}
