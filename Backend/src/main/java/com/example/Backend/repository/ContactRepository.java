package com.example.Backend.repository;

import com.example.Backend.entity.contact.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact,Long> {
}
