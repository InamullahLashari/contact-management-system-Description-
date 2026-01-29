package com.example.backend.serviceImpI.contact;

import com.example.backend.dto.contact.ContactDto;
import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.dto.email.ContactEmailDto;
import com.example.backend.dto.phone.ContactPhoneDto;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.contactemail.ContactEmail;
import com.example.backend.entity.contactphone.ContactPhone;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.repository.contact.ContactRepository;
import com.example.backend.repository.email.EmailRepository;
import com.example.backend.repository.phone.PhoneRepository;
import com.example.backend.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContactServiceImpITest {

    private PhoneRepository phoneRepo;
    private UserRepository userRepo;
    private EmailRepository emailRepo;
    private ContactRepository contactRepo;

    private ContactServiceImpI contactService;

    @BeforeEach
    void setUp() {
        phoneRepo = mock(PhoneRepository.class);
        userRepo = mock(UserRepository.class);
        emailRepo = mock(EmailRepository.class);
        contactRepo = mock(ContactRepository.class);

        contactService = new ContactServiceImpI(phoneRepo, userRepo, emailRepo, contactRepo);
    }

    @Test
    void testCreateContact_success() {
        // Mocked user
        String userEmail = "user@example.com";
        User user = new User();
        user.setId(1L);
        user.setEmail(userEmail);
        when(userRepo.findByEmailIgnoreCase(userEmail)).thenReturn(Optional.of(user));

        // Payload
        ContactEmailDto emailDto = new ContactEmailDto();
        emailDto.setEmailAddress("test@example.com");
        emailDto.setLabel("work");

        ContactPhoneDto phoneDto = new ContactPhoneDto();
        phoneDto.setPhoneNumber("1234567890");
        phoneDto.setLabel("mobile");

        ContactDto contactDto = new ContactDto();
        contactDto.setFirstName("John");
        contactDto.setLastName("Doe");
        contactDto.setTitle("Manager");
        contactDto.setEmails(List.of(emailDto));
        contactDto.setPhones(List.of(phoneDto));

        // Mock repository save behavior
        Contact savedContact = new Contact();
        savedContact.setId(100L);
        savedContact.setFirstName(contactDto.getFirstName());
        savedContact.setLastName(contactDto.getLastName());
        savedContact.setTitle(contactDto.getTitle());
        savedContact.setUser(user);

        ContactEmail savedEmail = new ContactEmail();
        savedEmail.setId(10L);
        savedEmail.setEmailAddress(emailDto.getEmailAddress());
        savedEmail.setLabel(emailDto.getLabel());
        savedEmail.setContact(savedContact);

        ContactPhone savedPhone = new ContactPhone();
        savedPhone.setId(20L);
        savedPhone.setPhoneNumber(phoneDto.getPhoneNumber());
        savedPhone.setLabel(phoneDto.getLabel());
        savedPhone.setContact(savedContact);

        savedContact.setEmails(List.of(savedEmail));
        savedContact.setPhones(List.of(savedPhone));

        when(contactRepo.save(any(Contact.class))).thenReturn(savedContact);

        // Execute
        ContactResponseDto response = contactService.createContact(contactDto, userEmail);

        // Verify DTO response
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals(1, response.getEmails().size());
        assertEquals("test@example.com", response.getEmails().get(0).getEmailAddress());
        assertEquals(1, response.getPhones().size());
        assertEquals("1234567890", response.getPhones().get(0).getPhoneNumber());

        // Verify repository interactions
        verify(userRepo, times(1)).findByEmailIgnoreCase(userEmail);
        verify(emailRepo, times(1)).findByEmailAddress("test@example.com");
        verify(phoneRepo, times(1)).findByPhoneNumber("1234567890");

        // Verify saved contact using ArgumentCaptor
        ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);
        verify(contactRepo).save(contactCaptor.capture());
        Contact captured = contactCaptor.getValue();
        assertEquals("John", captured.getFirstName());
        assertEquals(1, captured.getEmails().size());
        assertEquals("test@example.com", captured.getEmails().get(0).getEmailAddress());
        assertEquals(1, captured.getPhones().size());
        assertEquals("1234567890", captured.getPhones().get(0).getPhoneNumber());
    }

    @Test
    void testCreateContact_emailExists_throwsException() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId(1L);
        user.setEmail(userEmail);
        when(userRepo.findByEmailIgnoreCase(userEmail)).thenReturn(Optional.of(user));

        ContactEmailDto emailDto = new ContactEmailDto();
        emailDto.setEmailAddress("existing@example.com");
        emailDto.setLabel("work");

        ContactDto contactDto = new ContactDto();
        contactDto.setFirstName("John");
        contactDto.setLastName("Doe");
        contactDto.setTitle("Manager");
        contactDto.setEmails(List.of(emailDto));

        when(emailRepo.findByEmailAddress("existing@example.com"))
                .thenReturn(Optional.of(new ContactEmail()));

        assertThrows(InvalidActionException.class,
                () -> contactService.createContact(contactDto, userEmail));

        verify(emailRepo, times(1)).findByEmailAddress("existing@example.com");
    }

    @Test
    void testCreateContact_phoneExists_throwsException() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId(1L);
        user.setEmail(userEmail);
        when(userRepo.findByEmailIgnoreCase(userEmail)).thenReturn(Optional.of(user));

        ContactPhoneDto phoneDto = new ContactPhoneDto();
        phoneDto.setPhoneNumber("9999999999");
        phoneDto.setLabel("mobile");

        ContactDto contactDto = new ContactDto();
        contactDto.setFirstName("John");
        contactDto.setLastName("Doe");
        contactDto.setTitle("Manager");
        contactDto.setPhones(List.of(phoneDto));

        when(phoneRepo.findByPhoneNumber("9999999999"))
                .thenReturn(Optional.of(new ContactPhone()));

        assertThrows(InvalidActionException.class,
                () -> contactService.createContact(contactDto, userEmail));

        verify(phoneRepo, times(1)).findByPhoneNumber("9999999999");
    }
}
