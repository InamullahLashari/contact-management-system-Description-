package com.example.backend.serviceImpI.group;

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
import com.example.backend.service.group.GroupCreateService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
public class GroupCreateServiceImpl implements GroupCreateService {

    private final GroupCreateRepository groupRepo;
    private final UserRepository userRepo;

    private final ContactRepository contactRepo;
     private final GroupMapper  groupMapper;

    public GroupCreateServiceImpl(GroupCreateRepository groupRepo,
                                  UserRepository userRepo, ContactRepository contactRepo, GroupMapper  groupMapper){
        this.groupRepo = groupRepo;
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.groupMapper = groupMapper;

    }




    @Transactional
    @Override
    public GroupResponseDto createGroup(GroupCreateRequest request, String email) {
        User user = getUserByEmail(email);

        // Check group name uniqueness per user
        validateGroupName(request.getGroupName(), user);

        // Fetch and validate phones efficiently
        Set<Contact> newContact = getConatct(request.getContactIds(), user);


        Group group = buildGroup(request, user, newContact);

        Group groups = groupRepo.save(group);

        return groupMapper.toDto(groups);


    }

    private User getUserByEmail(String email) {
        return userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private void validateGroupName(String groupName, User user) {
        var groupOpt = groupRepo.findByGroupNameAndUserId(groupName, user.getId());
        if (groupOpt.isPresent()) {
            throw new EntityExistsException("Group with this name already exists for this user");
        }
    }

private Set<Contact> getConatct(Set<Long> contactIds, User user) {
    if (contactIds == null || contactIds.isEmpty()) {
        throw new IllegalArgumentException("At least two contacts must be added to a group");
    }

    List<Contact> contacts =
            contactRepo.findAllByIdInAndUserId(contactIds, user.getId());

    if (contacts.size() < 2) {
        throw new IllegalArgumentException("At least two contacts must be added to a group");
    }

    // here doing EXPLICIT conversion
    return new HashSet<>(contacts);
}



    private Group buildGroup(GroupCreateRequest request, User user, Set<Contact> newContact) {
        Group group = new Group();
        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        group.setUser(user);

        // here Hibernate-safe
        group.getContacts().addAll(newContact);

        return group;
    }

//========================================fetch Group========================================//

    @Override
    @Transactional
    public Set<ListGroupResponse> getAllGroups(String email) {
        User user =   userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Set<Group> groups = groupRepo.findByUser_Id(user.getId());

        if (groups.isEmpty()) {
            throw new EntityNotFoundException("No groups found for this user");
        }

        return groupMapper.toDto(groups);
    }




}