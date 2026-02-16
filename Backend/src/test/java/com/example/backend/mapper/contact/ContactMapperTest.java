package com.example.backend.mapper.contact;

import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.dto.email.ContactEmailResponseDto;
import com.example.backend.dto.phone.ContactPhoneResponseDto;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.contactemail.ContactEmail;
import com.example.backend.entity.contactphone.ContactPhone;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ContactMapperTest {

    private ContactMapper contactMapper;

    @BeforeEach
    void setup() {
        contactMapper = new ContactMapper();
    }

    @Test
    void toDto_mapsAllFieldsCorrectly() {
        // Create sample Contact
        Contact contact = new Contact();
        contact.setId(1L);
        contact.setFirstName("John");
        contact.setLastName("Doe");
        contact.setTitle("Manager");

        // Add emails
        ContactEmail email1 = new ContactEmail();
        email1.setId(10L);
        email1.setLabel("Work");
        email1.setEmailAddress("john.doe@company.com");

        ContactEmail email2 = new ContactEmail();
        email2.setId(11L);
        email2.setLabel("Personal");
        email2.setEmailAddress("john.doe@gmail.com");

        contact.setEmails(List.of(email1, email2));

        // Add phones
        ContactPhone phone1 = new ContactPhone();
        phone1.setId(20L);
        phone1.setLabel("Mobile");
        phone1.setPhoneNumber("1234567890");

        ContactPhone phone2 = new ContactPhone();
        phone2.setId(21L);
        phone2.setLabel("Office");
        phone2.setPhoneNumber("0987654321");

        contact.setPhones(List.of(phone1, phone2));

        // Map to DTO
        ContactResponseDto dto = contactMapper.toDto(contact);

        // Assertions
        assertEquals(contact.getId(), dto.getId());
        assertEquals(contact.getFirstName(), dto.getFirstName());
        assertEquals(contact.getLastName(), dto.getLastName());
        assertEquals(contact.getTitle(), dto.getTitle());

        // Emails
        assertEquals(2, dto.getEmails().size());
        ContactEmailResponseDto dtoEmail1 = dto.getEmails().get(0);
        assertEquals(email1.getId(), dtoEmail1.getId());
        assertEquals(email1.getLabel(), dtoEmail1.getLabel());
        assertEquals(email1.getEmailAddress(), dtoEmail1.getEmailAddress());

        // Phones
        assertEquals(2, dto.getPhones().size());
        ContactPhoneResponseDto dtoPhone1 = dto.getPhones().get(0);
        assertEquals(phone1.getId(), dtoPhone1.getId());
        assertEquals(phone1.getLabel(), dtoPhone1.getLabel());
        assertEquals(phone1.getPhoneNumber(), dtoPhone1.getPhoneNumber());
    }
}
