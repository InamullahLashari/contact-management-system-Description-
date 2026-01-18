package com.example.Backend.serviceImpI.group;
import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;
import com.example.Backend.dto.group.ListGroupResponse;
import com.example.Backend.dto.phone.GroupWithPhonesDto;
import com.example.Backend.entity.contact.Contact;
import com.example.Backend.entity.contactphone.ContactPhone;
import com.example.Backend.entity.group.Group;
import com.example.Backend.entity.user.User;

import com.example.Backend.mapper.group.GroupMapper;
import com.example.Backend.repository.contact.ContactRepository;
import com.example.Backend.repository.group.GroupCreateRepository;
import com.example.Backend.repository.phone.PhoneRepository;
import com.example.Backend.repository.user.UserRepository;
import com.example.Backend.service.Group.GroupCreateService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;


@Service
public class GroupCreateServiceImpI implements GroupCreateService {

    @Autowired
    private GroupCreateRepository groupRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PhoneRepository phoneRepo;

    @Autowired
    private ContactRepository contactRepo;

    @Autowired
     private GroupMapper  groupMapper;


    @Transactional
    @Override
    public GroupResponseDto createGroup(GroupCreateRequest request, String email) {
        User user = getUserByEmail(email);

        // Check group name uniqueness per user
        validateGroupName(request.getGroupName(), user);

        // Fetch and validate phones efficiently
        Set<Contact> newContact = getConatct(request.getContactIds(), user);

        // Build & save group
        Group group = buildGroup(request, user, newContact);
        group = groupRepo.save(group);

        return groupMapper.toDto(group);

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


        Set<Contact> contactgrup = contactRepo.findAllByIdInAndUserId(contactIds, user.getId());

        if (contactgrup.size() != contactgrup.size()) {
            throw new EntityNotFoundException("Some phone IDs do not belong to the current user");
        }

        if (contactgrup.size() < 2) {
            throw new IllegalArgumentException("At least two contacts must be added to a group");
        }

        return contactgrup;
    }

    private Group buildGroup(GroupCreateRequest request, User user, Set<Contact> newContact) {
        Group group = new Group();
        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        group.setUser(user);
        group.setContacts(newContact);

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