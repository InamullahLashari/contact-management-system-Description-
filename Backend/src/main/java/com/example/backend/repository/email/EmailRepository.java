package com.example.backend.repository.email;

import com.example.backend.entity.contactemail.ContactEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailRepository extends JpaRepository<ContactEmail, Long> {


    Optional<ContactEmail> findByEmailAddressAndContact_User_Id(String emailAddress, Long User_Id);


}
