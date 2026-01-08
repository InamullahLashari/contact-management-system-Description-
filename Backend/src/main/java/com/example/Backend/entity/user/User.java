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

    private String password;


    private boolean active = true;
    private boolean verified = false;
    private String refreshToken;
    private LocalDateTime lastLogin;
    private String verificationToken;
    private LocalDateTime tokenExpiry;
    private String resetPasswordToken;
    private LocalDateTime resetTokenExpiry;

    @Column(name = "is_deleted")
    private boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Contact> contacts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Group> groups;






}
