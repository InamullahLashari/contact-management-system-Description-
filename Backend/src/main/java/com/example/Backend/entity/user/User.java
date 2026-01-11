package com.example.Backend.entity.user;

import com.example.Backend.entity.contact.Contact;
import com.example.Backend.entity.group.Group;
import com.example.Backend.entity.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;
    private String refreshToken;
    private String password;
    private boolean active = true;
    private boolean verified = false;
    private LocalDateTime tokenExpiry;
    @Column(name = "is_deleted")
    private boolean deleted = false;
    private LocalDateTime lastLogin;
    private String resetPasswordToken;
    private LocalDateTime resetTokenExpiry;
    private String verificationToken;


    // Role-based access
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // One user → Many contacts
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts;

    // One user → Many groups
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Group> groups;
}




