package com.example.Backend.entity.contactphone;

import com.example.Backend.entity.contact.Contact;
import com.example.Backend.entity.group.Group;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "contact_phones")
public class ContactPhone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phoneNumber;

    @Column(nullable = false)
    private String label; // work, home, personal, mobile

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    // Many-to-Many with Group
    @ManyToMany(mappedBy = "phones", fetch = FetchType.LAZY)
    private Set<Group> groups;
}
