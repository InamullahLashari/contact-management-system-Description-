package com.example.Backend.mapper.group;

import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;
import com.example.Backend.dto.group.ListGroupResponse;
import com.example.Backend.entity.contact.Contact;
import com.example.Backend.entity.group.Group;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Component
public class GroupMapper {

    // Convert Group entity to GroupResponseDto
    public GroupResponseDto toDto(Group group) {
        if (group == null) return null;

        GroupResponseDto dto = new GroupResponseDto();
        dto.setId(group.getId());
        dto.setGroupName(group.getGroupName());
        dto.setDescription(group.getDescription());


        // Contacts → Contact IDs
        dto.setContactIds(
                group.getContacts()
                        .stream()
                        .map(Contact::getId)
                        .collect(Collectors.toSet())
        );

        return dto;
    }


    public Set<ListGroupResponse> toDto(Set<Group> groups) {

        Set<ListGroupResponse> dtoSet = new HashSet<>();

        for (Group group : groups) {

            ListGroupResponse dto = new ListGroupResponse();
            dto.setId(group.getId());
            dto.setName(group.getGroupName());
            dto.setDescription(group.getDescription());

            dtoSet.add(dto);
        }

        return dtoSet;
    }


}