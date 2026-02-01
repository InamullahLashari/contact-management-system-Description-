package com.example.backend.serviceImpI.contact;

import com.example.backend.dto.contact.*;
import com.example.backend.dto.email.ContactEmailDto;
import com.example.backend.dto.phone.ContactPhoneDto;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.mapper.contact.ContactMapper;
import com.example.backend.repository.contact.ContactRepository;
import com.example.backend.repository.email.EmailRepository;
import com.example.backend.repository.phone.PhoneRepository;
import com.example.backend.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ContactServiceImpITest {

    @Mock
    private PhoneRepository phoneRepo;
    @Mock
    private UserRepository userRepo;
    @Mock
    private EmailRepository emailRepo;
    @Mock
    private ContactRepository contactRepo;
    @Mock
    private ContactMapper contactMapper;

    @InjectMocks
    private ContactServiceImpI contactService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@mail.com");
    }

//==============================================createContact=========================
    @Test
    void createContact_success() {
        // Arrange
        ContactDto dto = new ContactDto();
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setTitle("Mr");

        ContactEmailDto emailDto = new ContactEmailDto();
        emailDto.setEmailAddress("john@mail.com");
        emailDto.setLabel("work");

        ContactPhoneDto phoneDto = new ContactPhoneDto();
        phoneDto.setPhoneNumber("123456");
        phoneDto.setLabel("mobile");

        dto.setEmails(List.of(emailDto));
        dto.setPhones(List.of(phoneDto));

        when(userRepo.findByEmailIgnoreCase("test@mail.com")).thenReturn(Optional.of(user));
        when(emailRepo.findByEmailAddressAndContact_User_Id(anyString(), anyLong()))
                .thenReturn(Optional.empty());
        when(phoneRepo.findByPhoneNumberAndContact_User_Id(anyString(), anyLong()))
                .thenReturn(Optional.empty());

        Contact savedContact = new Contact();
        savedContact.setId(100L);

        when(contactRepo.save(any(Contact.class))).thenReturn(savedContact);
        when(contactMapper.toDto(savedContact)).thenReturn(new ContactResponseDto());

        // Act
        ContactResponseDto response = contactService.createContact(dto, "test@mail.com");

        // Assert
        assertNotNull(response);
        verify(contactRepo).save(any(Contact.class));
    }


    @Test
    void createContact_shouldThrow_whenEmailExists() {
        ContactDto dto = new ContactDto();

        ContactEmailDto emailDto = new ContactEmailDto();
        emailDto.setEmailAddress("dup@mail.com");
        dto.setEmails(List.of(emailDto));

        when(userRepo.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(user));
        when(emailRepo.findByEmailAddressAndContact_User_Id(anyString(), anyLong()))
                .thenReturn(Optional.of(mock(com.example.backend.entity.contactemail.ContactEmail.class)));

        assertThrows(InvalidActionException.class,
                () -> contactService.createContact(dto, "test@mail.com"));
    }


    @Test
    void createContact_shouldThrow_whenUserNotFound() {
        when(userRepo.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> contactService.createContact(new ContactDto(), "bad@mail.com"));
    }
    @Test
    void getContact_success() {
        Contact contact = new Contact();
        contact.setId(10L);
        contact.setUser(user);

        when(contactRepo.findById(10L)).thenReturn(Optional.of(contact));
        when(contactMapper.toDto(contact)).thenReturn(new ContactResponseDto());

        ContactResponseDto dto = contactService.getContact(10L, "test@mail.com");

        assertNotNull(dto);
    }
    @Test
    void updateContact_shouldThrow_whenDuplicateEmail() {
        Contact contact = new Contact();
        contact.setUser(user);
        contact.setEmails(new ArrayList<>());
        contact.setPhones(new ArrayList<>());

        ContactUpdateDto dto = new ContactUpdateDto();
        ContactEmailDto email1 = new ContactEmailDto();
        email1.setEmailAddress("same@mail.com");

        ContactEmailDto email2 = new ContactEmailDto();
        email2.setEmailAddress("same@mail.com");

        dto.setEmails(List.of(email1, email2));

        when(userRepo.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(user));
        when(contactRepo.findByIdAndUser(anyLong(), any(User.class))).thenReturn(Optional.of(contact));

        assertThrows(InvalidActionException.class,
                () -> contactService.updateContact(1L, "test@mail.com", dto));
    }

    @Test
    void deleteContact_success() {
        Contact contact = new Contact();
        contact.setUser(user);

        when(userRepo.findByEmailIgnoreCase(anyString())).thenReturn(Optional.of(user));
        when(contactRepo.findByIdAndUser(anyLong(), any(User.class))).thenReturn(Optional.of(contact));

        boolean result = contactService.deleteContact(1L, "test@mail.com");

        assertTrue(result);
        verify(contactRepo).delete(contact);
    }

    @Test
    void contactList_success() {
        Contact contact = new Contact();
        Page<Contact> page = new PageImpl<>(List.of(contact));
        Pageable pageable = PageRequest.of(0, 10);

        when(contactRepo.findUserContacts(anyString(), anyString(), any()))
                .thenReturn(page);
        when(contactMapper.toDto(any())).thenReturn(new ContactResponseDto());

        Page<ContactResponseDto> result = contactService.contactList("user@mail.com", "", pageable);

        assertEquals(1, result.getContent().size());
    }


}