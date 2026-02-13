package com.example.backend.controller.group;


import com.example.backend.dto.ApIResponse.ApiResponse;
import com.example.backend.dto.group.GroupCreateRequest;
import com.example.backend.dto.group.GroupResponseDto;
import com.example.backend.dto.group.ListGroupResponse;
import com.example.backend.service.group.GroupCreateService;
import com.example.backend.util.AuthenticationUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
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

        // Wrap into a Map with total count
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("totalGroups", groups.size());
        responseData.put("groups", groups);

        // Return in standard API response
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "success",
                        "Groups fetched successfully",
                        responseData
                )
        );
    }
    //=================================delete Group================================================//
    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long groupId) {
        String email = authUtil.getEmail();
        log.info("Request to delete group {} by {}", groupId, email);

        try {
            groupService.deleteGroup(groupId, email);
            return ResponseEntity.ok(new ApiResponse<>("success", "Group deleted successfully", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("error", "Failed to delete group", null));
        }
    }


}
