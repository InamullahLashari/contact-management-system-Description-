package com.example.Backend.serviceImpI.user;

import com.example.Backend.entity.user.User;
import com.example.Backend.exception.InvalidActionException;
import com.example.Backend.repository.user.UserRepository;
import com.example.Backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpI implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public User signUpUser(User user) {
        // Check if user already exists
        userRepository.findByEmailIgnoreCase(user.getEmail()).ifPresent(existingUser -> {
            throw new InvalidActionException("Email already in use");
        });

        // 2⃣ Encode password
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        //  Create new user entity
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(encodedPassword);
        newUser.setName(user.getName()); // optional: if you have a name field

        // 4 Save and return
        return userRepository.save(newUser);
    }

}
