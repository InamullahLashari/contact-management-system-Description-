package com.example.Backend.serviceImpI.user;

import com.example.Backend.entity.role.Role;
import com.example.Backend.entity.user.User;
import com.example.Backend.exception.InvalidActionException;
import com.example.Backend.repository.role.RoleRepository;
import com.example.Backend.repository.user.UserRepository;
import com.example.Backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpI implements UserService{

    @Autowired private UserRepository userRepository;

    @Autowired  private PasswordEncoder passwordEncoder;

    @Autowired private RoleRepository roleRepository;



//==================================signUp Implementation=================================//
@Override
public User signUpUser(User user) {


    userRepository.findByEmailIgnoreCase(user.getEmail()).ifPresent(existingUser -> {
        throw new InvalidActionException("Email already in use");
    });



    Role role = roleRepository.findByRoleName("ROLE_USER")
            .orElseThrow(() -> new EntityNotFoundException("Role not found"));
    String encodedPassword = passwordEncoder.encode(user.getPassword());


    User newUser = new User();
    newUser.setRole(role);
    newUser.setActive(true);
    newUser.setDeleted(false);
    newUser.setVerified(false);
    newUser.setEmail(user.getEmail());
    newUser.setPassword(encodedPassword);
    newUser.setName(user.getName());
    newUser.setLastLogin(null);



    return userRepository.save(newUser);
}


}
