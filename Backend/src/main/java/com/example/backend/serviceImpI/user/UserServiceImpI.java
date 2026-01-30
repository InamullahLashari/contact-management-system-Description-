package com.example.backend.serviceImpI.user;

import com.example.backend.entity.role.Role;
import com.example.backend.entity.roleEnum.RoleName;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.repository.role.RoleRepository;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpI implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;

    public UserServiceImpI(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;


    }

    //==================================signUp Implementation=================================//
    @Override
    public User signUpUser(User user) {


        userRepository.findByEmailIgnoreCase(user.getEmail()).ifPresent(existingUser -> {
            throw new InvalidActionException("Email already in use");
        });


        Role role = roleRepository.findByRoleName(RoleName.ROLE_USER)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        String encodedPassword = passwordEncoder.encode(user.getPassword());


        User newUser = new User();
        newUser.setRole(role);
        newUser.setDeleted(false);
        newUser.setEmail(user.getEmail());
        newUser.setPassword(encodedPassword);
        newUser.setName(user.getName());
        newUser.setLastLogin(null);


        return userRepository.save(newUser);
    }


}
