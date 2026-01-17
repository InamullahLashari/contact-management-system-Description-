package com.example.Backend.mapper.group;

import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;
import com.example.Backend.entity.group.Group;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class GroupMapper {

    public GroupResponseDto toDto(Group group) {
        if (group == null) return null;

        GroupResponseDto dto = new GroupResponseDto();
        dto.setId(group.getId());
        dto.setGroupName(group.getGroupName());
        dto.setDescription(group.getDescription());

        // Map phone IDs only
        dto.setPhoneIds(
                group.getPhones() != null
                        ? group.getPhones().stream()
                        .map(p -> p.getId())
                        .collect(Collectors.toSet())
                        : Set.of()
        );

        return dto;
    }

    public Group toEntity(GroupCreateRequest request) {
        if (request == null) return null;

        Group group = new Group();
        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        // Phones will be set in service
        return group;
    }
}
