package com.example.backend.service.group;

import com.example.backend.dto.group.GroupCreateRequest;
import com.example.backend.dto.group.GroupResponseDto;
import com.example.backend.dto.group.ListGroupResponse;

import java.util.Set;

public interface GroupCreateService {

    GroupResponseDto createGroup(GroupCreateRequest request, String email);

    Set<ListGroupResponse> getAllGroups(String email);
    void deleteGroup(Long groupId, String email);


}

