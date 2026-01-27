package com.example.Backend.repository.contact;

import com.example.Backend.entity.contact.Contact;
import com.example.Backend.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.Set;


public interface ContactRepository extends JpaRepository<Contact,Long> {

    @Query("""
SELECT DISTINCT c FROM Contact c
LEFT JOIN c.phones p
WHERE (:keyword IS NULL OR :keyword = '' 
    OR LOWER(c.firstName) LIKE LOWER(CONCAT(:keyword, '%'))
    OR (p.label = 'mobile' AND p.phoneNumber LIKE CONCAT('%', :keyword, '%'))
)
""")
    Page<Contact> searchContacts(@Param("keyword") String keyword, Pageable pageable);

    Optional<Contact> findByIdAndUser(Long id, User user);
//    Set<Contact> findAllByIdInAndUserId(Set<Long> ids, Long userId);

    List<Contact> findAllByIdInAndUserId(Set<Long> ids, Long userId);


}





