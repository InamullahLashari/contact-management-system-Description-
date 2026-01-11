package com.example.Backend.entity.contact;

import com.example.Backend.entity.contactemail.ContactEmail;
import com.example.Backend.entity.contactphone.ContactPhone;
import com.example.Backend.entity.group.Group;
import com.example.Backend.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String title;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Contact → Emails (multiple, labeled)
    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactEmail> emails;

    // Contact → Phones (multiple, labeled)
    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactPhone> phones;

    // Many-to-Many → Groups (bonus)
    @ManyToMany
    @JoinTable(
            name = "contact_groups",
            joinColumns = @JoinColumn(name = "contact_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private Set<Group> groups;
}
