package com.example.backend.controller.group;

import com.example.backend.dto.group.GroupCreateRequest;
import com.example.backend.dto.group.GroupResponseDto;
import com.example.backend.dto.group.ListGroupResponse;
import com.example.backend.service.group.GroupCreateService;
import com.example.backend.util.AuthenticationUtil;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashSet;
import java.util.Set;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class GroupCreateControllerTest {

    @InjectMocks
    private GroupCreateController groupController;

    @Mock
    private GroupCreateService groupService;

    @Mock
    private AuthenticationUtil authUtil;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(groupController).build();
    }

    // =============================
    // CREATE GROUP TEST
    // =============================
    @Test
    void createGroup_shouldReturnCreatedGroup() throws Exception {
        GroupCreateRequest request = new GroupCreateRequest();
        request.setGroupName("Friends");

        GroupResponseDto responseDto = new GroupResponseDto();
        responseDto.setId(1L);
        responseDto.setGroupName("Friends");

        when(authUtil.getEmail()).thenReturn("test@mail.com");
        when(groupService.createGroup(Mockito.any(GroupCreateRequest.class), Mockito.anyString()))
                .thenReturn(responseDto);

        mockMvc.perform(post("/group")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Group created successfully"))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.groupName").value("Friends"));
    }

    // =============================
    // GET ALL GROUPS TEST
    // =============================
    @Test
    void getAllGroup_shouldReturnGroups() throws Exception {
        ListGroupResponse group1 = new ListGroupResponse();
        group1.setId(1L);
        group1.setGroupName("Friends");

        ListGroupResponse group2 = new ListGroupResponse();
        group2.setId(2L);
        group2.setGroupName("Family");

        Set<ListGroupResponse> groups = new HashSet<>();
        groups.add(group1);
        groups.add(group2);

        when(authUtil.getEmail()).thenReturn("test@mail.com");
        when(groupService.getAllGroups(Mockito.anyString())).thenReturn(groups);

        mockMvc.perform(get("/group"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Groups fetched successfully"))
                .andExpect(jsonPath("$.data.totalGroups").value(2))
                .andExpect(jsonPath("$.data.groups", hasSize(2)));
    }

    // =============================
    // DELETE GROUP SUCCESS
    // =============================
    @Test
    void deleteGroup_shouldReturnSuccess() throws Exception {
        when(authUtil.getEmail()).thenReturn("test@mail.com");
        doNothing().when(groupService).deleteGroup(1L, "test@mail.com");

        mockMvc.perform(delete("/group/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.message").value("Group deleted successfully"));
    }

    // =============================
    // DELETE GROUP NOT FOUND
    // =============================
    @Test
    void deleteGroup_shouldReturnNotFound() throws Exception {
        when(authUtil.getEmail()).thenReturn("test@mail.com");
        doThrow(new EntityNotFoundException("Group not found"))
                .when(groupService).deleteGroup(1L, "test@mail.com");

        mockMvc.perform(delete("/group/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Group not found"));
    }

    // =============================
    // DELETE GROUP FORBIDDEN
    // =============================
    @Test
    void deleteGroup_shouldReturnForbidden() throws Exception {
        when(authUtil.getEmail()).thenReturn("test@mail.com");
        doThrow(new SecurityException("Access denied"))
                .when(groupService).deleteGroup(1L, "test@mail.com");

        mockMvc.perform(delete("/group/1"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    // =============================
    // DELETE GROUP INTERNAL ERROR
    // =============================
    @Test
    void deleteGroup_shouldReturnInternalServerError() throws Exception {
        when(authUtil.getEmail()).thenReturn("test@mail.com");
        doThrow(new RuntimeException("Unexpected error"))
                .when(groupService).deleteGroup(1L, "test@mail.com");

        mockMvc.perform(delete("/group/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Failed to delete group"));
    }
}
