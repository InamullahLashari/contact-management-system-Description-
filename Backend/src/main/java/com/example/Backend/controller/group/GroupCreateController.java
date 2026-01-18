package com.example.Backend.controller.group;


import com.example.Backend.dto.ApIResponse.ApiResponse;
import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;
import com.example.Backend.dto.group.ListGroupResponse;
import com.example.Backend.dto.phone.GroupWithPhonesDto;
import com.example.Backend.entity.group.Group;
import com.example.Backend.service.Group.GroupCreateService;
import com.example.Backend.util.AuthenticationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@Slf4j
@RestController
@RequestMapping("/group")
public class GroupCreateController {
    @Autowired
    private GroupCreateService groupService;
    private @Autowired AuthenticationUtil authUtil;


    //=================================Create Group=======================================//
    @PostMapping
    public ResponseEntity<?> createGroup(
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
//=================================Fetch Group================================================//

    @GetMapping
    public ResponseEntity<?> getAllGroup() {
        // Get logged-in user email from token
        String email = authUtil.getEmail();
        log.info("Authenticated email: {}", email);


        Set<ListGroupResponse> groups = groupService.getAllGroups(email);

        log.info("Returning all groups: {}", groups);

        // Return in standard API response
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Groups fetched successfully",
                        groups
                )
        );
    }


}
