package com.example.backend.entity.group;

import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // here  Prevent infinite recursion
@Entity
@Table(
        name = "groups",
        uniqueConstraints = @UniqueConstraint(columnNames = {"group_name", "user_id"})
)
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // here Only include ID for equals/hashCode
    private Long id;

    @Column(nullable = false)
    private String groupName;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(fetch = FetchType.LAZY) // LAZY to avoid N+1
    @JoinTable(
            name = "group_contacts",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "contact_id")
    )
    private Set<Contact> contacts = new HashSet<>(); // here Initialize collection
}
