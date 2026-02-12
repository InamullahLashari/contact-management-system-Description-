package com.example.backend.repository.contact;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;


public interface ContactRepository extends JpaRepository<Contact, Long> {


    @Query("""
SELECT c FROM Contact c
WHERE c.user.email = :email
AND (
    :keyword IS NULL OR :keyword = '' OR
    LOWER(c.firstName) LIKE LOWER(CONCAT(:keyword, '%'))
)
""")
    Page<Contact> findUserContacts(String email, String keyword, Pageable pageable);



    Optional<Contact> findByIdAndUser(Long id, User user);
    List<Contact> findAllByIdInAndUserId(Set<Long> ids, Long userId);




}





