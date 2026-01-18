package com.example.Backend.service.Group;

import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;
import com.example.Backend.dto.group.ListGroupResponse;
import com.example.Backend.dto.phone.GroupWithPhonesDto;
import com.example.Backend.entity.group.Group;

import java.util.List;
import java.util.Set;

public interface GroupCreateService {

    GroupResponseDto createGroup(GroupCreateRequest request, String email);

    Set<ListGroupResponse> getAllGroups(String email);






}

