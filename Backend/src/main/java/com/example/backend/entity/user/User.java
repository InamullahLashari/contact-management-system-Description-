package com.example.backend.entity.user;

import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.group.Group;
import com.example.backend.entity.role.Role;
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

    @Column(nullable = false)
    private String password;

    private String refreshToken;

    @Column(name = "is_deleted")
    private boolean deleted = false; // soft delete

    private LocalDateTime lastLogin;

    @Transient
    private String confirmPassword;
//    // password reset
//    private String resetPasswordToken;
//    private LocalDateTime resetTokenExpiry;

    // Role-based access
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // One user → Many contacts
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Contact> contacts;

    // One user → Many groups
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Group> groups;
}
