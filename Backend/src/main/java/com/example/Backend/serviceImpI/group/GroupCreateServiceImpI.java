package com.example.Backend.serviceImpI.group;

import com.example.Backend.dto.group.GroupCreateRequest;
import com.example.Backend.dto.group.GroupResponseDto;
import com.example.Backend.entity.contactphone.ContactPhone;
import com.example.Backend.entity.group.Group;
import com.example.Backend.entity.user.User;
import com.example.Backend.mapper.group.GroupMapper;
import com.example.Backend.repository.group.GroupCreateRepository;
import com.example.Backend.repository.phone.PhoneRepository;
import com.example.Backend.repository.user.UserRepository;
import com.example.Backend.service.Group.GroupCreateService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GroupCreateServiceImpI implements GroupCreateService {

    @Autowired
    private GroupCreateRepository groupRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PhoneRepository phoneRepo;
    @Autowired
    private GroupMapper groupMapper;




//==========================================groupCreate==========================================//
    @Transactional
    @Override
    public GroupResponseDto createGroup(GroupCreateRequest request, String email) {
        User user = getUserByEmail(email);
        validateGroupName(request.getGroupName(), user);
        Set<ContactPhone> phones = getUserPhones(request, user);

        Group group = buildGroup(request, user, phones);
        group = groupRepo.save(group);

        return groupMapper.toDto(group);
    }


    private User getUserByEmail(String email) {
        return userRepo.findByEmailIgnoreCase(email).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private void validateGroupName(String groupName, User user) {
        if (groupRepo.findByGroupName(groupName).filter(g -> g.getUser().getId().equals(user.getId())).isPresent()) {
            throw new EntityExistsException("Group with this name already exists for this user");
        }
    }

    private Set<ContactPhone> getUserPhones(GroupCreateRequest request, User user) {
        if (request.getPhoneIds() == null || request.getPhoneIds().isEmpty()) {
            throw new IllegalArgumentException("At least two contacts must be added to a group");
        }

        Set<ContactPhone> phones = new HashSet<>(phoneRepo.findAllById(request.getPhoneIds()).stream().filter(phone -> phone.getContact().getUser().getId().equals(user.getId())).collect(Collectors.toSet()));


        if (phones.size() != request.getPhoneIds().size()) {
            throw new EntityNotFoundException("Some phone IDs do not belong to the current user");
        }
        //  at least 2 phones are added
        if (phones.size() < 2) {
            throw new IllegalArgumentException("At least two contacts must be added to a group");
        }

        return phones;
    }

    private Group buildGroup(GroupCreateRequest request, User user, Set<ContactPhone> phones) {
        Group group = new Group();
        group.setGroupName(request.getGroupName());
        group.setDescription(request.getDescription());
        group.setUser(user);
        group.setPhones(phones);
        return group;
    }

    //==========================================fetch group==========================================//

}
