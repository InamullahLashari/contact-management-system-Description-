package com.example.Backend.repository.phone;

import com.example.Backend.entity.contactphone.ContactPhone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface PhoneRepository extends JpaRepository<ContactPhone,Long> {

    Optional<ContactPhone> findByPhoneNumber(String phoneNumber);
}
