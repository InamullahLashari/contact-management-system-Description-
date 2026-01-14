package com.example.Backend.repository.contact;

import com.example.Backend.entity.contact.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ContactRepository extends JpaRepository<Contact,Long> {

    @Query("""
    SELECT DISTINCT c FROM Contact c
    LEFT JOIN c.phones p
    LEFT JOIN c.emails e
    WHERE (:keyword IS NULL OR :keyword = '' 
        OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(p.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(e.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
""")

    Page<Contact> searchContacts(@Param("keyword") String keyword, Pageable pageable);




    }



