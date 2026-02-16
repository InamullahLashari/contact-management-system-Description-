package com.example.backend.serviceImpI;

import com.example.backend.dto.group.GroupCreateRequest;
import com.example.backend.dto.group.GroupResponseDto;
import com.example.backend.dto.group.ListGroupResponse;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.group.Group;
import com.example.backend.entity.user.User;
import com.example.backend.mapper.group.GroupMapper;
import com.example.backend.repository.contact.ContactRepository;
import com.example.backend.repository.group.GroupCreateRepository;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.serviceImpI.group.GroupCreateServiceImpl;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GroupCreateServiceImplTest {

    @Mock
    private GroupCreateRepository groupRepo;

    @Mock
    private UserRepository userRepo;

    @Mock
    private ContactRepository contactRepo;

    @Mock
    private GroupMapper groupMapper;

    @InjectMocks
    private GroupCreateServiceImpl service;

    private User user;
    private Contact contact1;
    private Contact contact2;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        contact1 = new Contact();
        contact1.setId(10L);

        contact2 = new Contact();
        contact2.setId(20L);
    }

    // ===================== CREATE GROUP =====================

    @Test
    void createGroup_shouldCreateSuccessfully() {
        GroupCreateRequest request = new GroupCreateRequest();
        request.setGroupName("Friends");
        request.setDescription("Best friends");
        request.setContactIds(Set.of(10L, 20L));

        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findByGroupNameAndUserId("Friends", 1L))
                .thenReturn(Optional.empty());

        when(contactRepo.findAllByIdInAndUserId(Set.of(10L, 20L), 1L))
                .thenReturn(List.of(contact1, contact2));

        when(groupRepo.save(any(Group.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(groupMapper.toDto(any(Group.class)))
                .thenReturn(new GroupResponseDto());

        GroupResponseDto response =
                service.createGroup(request, "test@test.com");

        assertNotNull(response);
        verify(groupRepo, times(1)).save(any(Group.class));
    }

    @Test
    void createGroup_shouldThrowException_whenUserNotFound() {
        when(userRepo.findByEmailIgnoreCase("wrong@test.com"))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                service.createGroup(new GroupCreateRequest(), "wrong@test.com"));
    }

    @Test
    void createGroup_shouldThrowException_whenGroupNameExists() {
        GroupCreateRequest request = new GroupCreateRequest();
        request.setGroupName("Friends");

        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findByGroupNameAndUserId("Friends", 1L))
                .thenReturn(Optional.of(new Group()));

        assertThrows(EntityExistsException.class, () ->
                service.createGroup(request, "test@test.com"));
    }

    @Test
    void createGroup_shouldThrowException_whenLessThanTwoContacts() {
        GroupCreateRequest request = new GroupCreateRequest();
        request.setGroupName("Friends");
        request.setContactIds(Set.of(10L));

        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findByGroupNameAndUserId(anyString(), anyLong()))
                .thenReturn(Optional.empty());

        when(contactRepo.findAllByIdInAndUserId(anySet(), anyLong()))
                .thenReturn(List.of(contact1)); // only one contact

        assertThrows(IllegalArgumentException.class, () ->
                service.createGroup(request, "test@test.com"));
    }

    // ===================== GET ALL GROUPS =====================

    @Test
    void getAllGroups_shouldReturnGroups() {
        Group group = new Group();
        group.setId(1L);
        group.setUser(user);

        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findByUser_Id(1L))
                .thenReturn(Set.of(group));

        when(groupMapper.toDto(anySet()))
                .thenReturn(Set.of(new ListGroupResponse()));

        Set<ListGroupResponse> result =
                service.getAllGroups("test@test.com");

        assertEquals(1, result.size());
    }

    @Test
    void getAllGroups_shouldThrowException_whenNoGroups() {
        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findByUser_Id(1L))
                .thenReturn(Collections.emptySet());

        assertThrows(EntityNotFoundException.class, () ->
                service.getAllGroups("test@test.com"));
    }

    // ===================== DELETE GROUP =====================

    @Test
    void deleteGroup_shouldDeleteSuccessfully() {
        Group group = new Group();
        group.setId(1L);
        group.setUser(user);

        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findById(1L))
                .thenReturn(Optional.of(group));

        service.deleteGroup(1L, "test@test.com");

        verify(groupRepo, times(1)).delete(group);
    }

    @Test
    void deleteGroup_shouldThrowException_whenUnauthorized() {
        User anotherUser = new User();
        anotherUser.setId(2L);

        Group group = new Group();
        group.setId(1L);
        group.setUser(anotherUser);

        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findById(1L))
                .thenReturn(Optional.of(group));

        assertThrows(SecurityException.class, () ->
                service.deleteGroup(1L, "test@test.com"));
    }

    @Test
    void deleteGroup_shouldThrowException_whenGroupNotFound() {
        when(userRepo.findByEmailIgnoreCase("test@test.com"))
                .thenReturn(Optional.of(user));

        when(groupRepo.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () ->
                service.deleteGroup(1L, "test@test.com"));
    }
}
