package com.example.backend.repository.phone;

import com.example.backend.entity.contactphone.ContactPhone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PhoneRepository extends JpaRepository<ContactPhone, Long> {

    Optional<ContactPhone> findByPhoneNumberAndContact_User_Id(String phoneNumber, Long User_Id);

}
