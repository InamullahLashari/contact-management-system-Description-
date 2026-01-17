package com.example.Backend.entity.group;

import com.example.Backend.entity.contact.Contact;
import com.example.Backend.entity.contactphone.ContactPhone;
import com.example.Backend.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String groupName;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Direct connection to phone numbers
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "group_phones",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "phone_id")
    )
    private Set<ContactPhone> phones;
}

