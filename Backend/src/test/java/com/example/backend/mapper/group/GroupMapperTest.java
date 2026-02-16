package com.example.backend.mapper.group;


import com.example.backend.dto.group.GroupResponseDto;
import com.example.backend.dto.group.ListGroupResponse;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.group.Group;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class GroupMapperTest {

    private GroupMapper groupMapper;

    @BeforeEach
    void setUp() {
        groupMapper = new GroupMapper();
    }

    // ===========================Test toDto(Group)=================



    @Test
    void toDto_shouldReturnNull_whenGroupIsNull() {
        GroupResponseDto result = groupMapper.toDto((Group) null);
        assertNull(result);
    }

    @Test
    void toDto_shouldMapGroupCorrectly() {
        // Arrange
        Group group = new Group();
        group.setId(1L);
        group.setGroupName("Friends");
        group.setDescription("Close friends");

        Contact contact1 = new Contact();
        contact1.setId(10L);
        contact1.setFirstName("John");

        Contact contact2 = new Contact();
        contact2.setId(20L);
        contact2.setFirstName("Jane");

        Set<Contact> contacts = new HashSet<>();
        contacts.add(contact1);
        contacts.add(contact2);
        group.setContacts(contacts);

        // Act
        GroupResponseDto dto = groupMapper.toDto(group);

        // Assert
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Friends", dto.getGroupName());
        assertEquals("Close friends", dto.getDescription());
        assertEquals(2, dto.getContactIds().size());
        assertTrue(dto.getContactIds().contains(10L));
        assertTrue(dto.getContactIds().contains(20L));
    }

    @Test
    void toDto_shouldHandleNullContacts() {
        Group group = new Group();
        group.setId(2L);
        group.setGroupName("Work");
        group.setDescription("Work colleagues");
        group.setContacts(null);

        GroupResponseDto dto = groupMapper.toDto(group);

        assertNotNull(dto);
        assertNotNull(dto.getContactIds());
        assertTrue(dto.getContactIds().isEmpty());
    }


   //============================= Test toDto(Set<Group>)


    @Test
    void toDtoSet_shouldReturnEmptySet_whenInputIsNull() {
        Set<ListGroupResponse> result = groupMapper.toDto((Set<Group>) null);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void toDtoSet_shouldMapGroupsCorrectly() {
        // Arrange
        Group group = new Group();
        group.setId(1L);
        group.setGroupName("Family");
        group.setDescription("Family group");

        Contact contact1 = new Contact();
        contact1.setId(100L);
        contact1.setFirstName("Alice");

        Contact contact2 = new Contact();
        contact2.setId(200L);
        contact2.setFirstName("Bob");

        Set<Contact> contacts = new HashSet<>();
        contacts.add(contact1);
        contacts.add(contact2);
        group.setContacts(contacts);

        Set<Group> groups = new HashSet<>();
        groups.add(group);

        // Act
        Set<ListGroupResponse> result = groupMapper.toDto(groups);

        // Assert
        assertEquals(1, result.size());

        ListGroupResponse dto = result.iterator().next();
        assertEquals(1L, dto.getId());
        assertEquals("Family", dto.getGroupName());
        assertEquals("Family group", dto.getDescription());
        assertEquals(2, dto.getContactFirstNames().size());
        assertTrue(dto.getContactFirstNames().contains("Alice"));
        assertTrue(dto.getContactFirstNames().contains("Bob"));
    }

    @Test
    void toDtoSet_shouldHandleGroupWithNullContacts() {
        Group group = new Group();
        group.setId(3L);
        group.setGroupName("Empty");
        group.setDescription("No contacts");
        group.setContacts(null);

        Set<Group> groups = new HashSet<>();
        groups.add(group);

        Set<ListGroupResponse> result = groupMapper.toDto(groups);

        ListGroupResponse dto = result.iterator().next();
        assertNotNull(dto.getContactFirstNames());
        assertTrue(dto.getContactFirstNames().isEmpty());
    }
}
