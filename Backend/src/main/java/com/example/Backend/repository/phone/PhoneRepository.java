package com.example.Backend.repository.phone;

import com.example.Backend.entity.contactphone.ContactPhone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface PhoneRepository extends JpaRepository<ContactPhone, Long> {

    Optional<ContactPhone> findByPhoneNumber(String phoneNumber);

//    @Query("SELECT p FROM ContactPhone p " +
//            "JOIN FETCH p.contact c " +
//            "JOIN FETCH c.user u " +
//            "WHERE p.id IN :ids AND u.id = :userId")
//    Set<ContactPhone> findAllByIdsAndUser(@Param("ids") Set<Long> ids, @Param("userId") Long userId);
}
