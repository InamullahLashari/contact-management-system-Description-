package com.example.Backend.controller.group;


import com.example.Backend.dto.ApIResponse.ApiResponse;
import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;
import com.example.Backend.service.Group.GroupCreateService;
import com.example.Backend.util.AuthenticationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/group")
public class GroupCreateController {
    @Autowired
    private GroupCreateService groupService;
    private @Autowired AuthenticationUtil authUtil;


    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponseDto>> createGroup(
            @RequestBody GroupCreateRequest request) {

        log.info("Creating group: {}", request);

        GroupResponseDto createdGroup =
                groupService.createGroup(request, authUtil.getEmail());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        "success",
                        "Group created successfully",
                        createdGroup
                ));
    }


}
