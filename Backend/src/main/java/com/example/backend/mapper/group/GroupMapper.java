
package com.example.backend.mapper.group;
import com.example.backend.dto.group.GroupResponseDto;
import com.example.backend.dto.group.ListGroupResponse;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.group.Group;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class GroupMapper {

    // Convert Group entity to GroupResponseDto
    public GroupResponseDto toDto(Group group) {
        if (group == null) {
            return null;
        }

        GroupResponseDto dto = new GroupResponseDto();
        dto.setId(group.getId());
        dto.setGroupName(group.getGroupName());
        dto.setDescription(group.getDescription());

        // Contacts → Contact IDs (no streams)
        Set<Long> contactIds = new HashSet<>();
        if (group.getContacts() != null) {
            for (Contact contact : group.getContacts()) {
                contactIds.add(contact.getId());
            }
        }
        dto.setContactIds(contactIds);

        return dto;
    }

    // Convert Set<Group> to Set<ListGroupResponse>
    public Set<ListGroupResponse> toDto(Set<Group> groups) {
        Set<ListGroupResponse> responseSet = new HashSet<>();

        if (groups == null) {
            return responseSet;
        }

        for (Group group : groups) {
            ListGroupResponse dto = new ListGroupResponse();
            dto.setId(group.getId());
            dto.setGroupName(group.getGroupName());
            dto.setDescription(group.getDescription());

            // Add first names of contacts (no streams)
            Set<String> contactFirstNames = new HashSet<>();
            if (group.getContacts() != null) {
                for (Contact contact : group.getContacts()) {
                    contactFirstNames.add(contact.getFirstName());
                }
            }

            dto.setContactFirstNames(contactFirstNames);
            responseSet.add(dto);
        }

        return responseSet;
    }
}
