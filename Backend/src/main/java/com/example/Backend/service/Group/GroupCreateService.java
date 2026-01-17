package com.example.Backend.service.Group;

import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;

public interface GroupCreateService {

    GroupResponseDto createGroup(GroupCreateRequest request, String email);






}

