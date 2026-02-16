package com.example.backend.serviceImpI.contact;

import com.example.backend.dto.contact.*;
import com.example.backend.dto.email.ContactEmailDto;
import com.example.backend.dto.phone.ContactPhoneDto;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.contactemail.ContactEmail;
import com.example.backend.entity.contactphone.ContactPhone;
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
import org.springframework.data.domain.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ContactServiceImpITest {

    @Mock private PhoneRepository phoneRepo;
    @Mock private UserRepository userRepo;
    @Mock private EmailRepository emailRepo;
    @Mock private ContactRepository contactRepo;
    @Mock private ContactMapper contactMapper;

    @InjectMocks
    private ContactServiceImpI contactService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@mail.com");
    }


    // ============================CREATE CONTACT================================

    @Test
    void createContact_success() {
        ContactDto dto = new ContactDto();
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setTitle("Mr");

        ContactEmailDto emailDto = new ContactEmailDto();
        emailDto.setEmailAddress("john@mail.com");

        ContactPhoneDto phoneDto = new ContactPhoneDto();
        phoneDto.setPhoneNumber("123456");

        dto.setEmails(List.of(emailDto));
        dto.setPhones(List.of(phoneDto));

        when(userRepo.findByEmailIgnoreCase(user.getEmail()))
                .thenReturn(Optional.of(user));
        when(emailRepo.findByEmailAddressAndContact_User_Id(any(), anyLong()))
                .thenReturn(Optional.empty());
        when(phoneRepo.findByPhoneNumberAndContact_User_Id(any(), anyLong()))
                .thenReturn(Optional.empty());

        Contact saved = new Contact();
        saved.setId(100L);

        when(contactRepo.save(any(Contact.class))).thenReturn(saved);
        when(contactMapper.toDto(saved)).thenReturn(new ContactResponseDto());

        ContactResponseDto result =
                contactService.createContact(dto, user.getEmail());

        assertNotNull(result);
        verify(contactRepo).save(any(Contact.class));
    }

    @Test
    void createContact_shouldThrow_whenUserNotFound() {
        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> contactService.createContact(new ContactDto(), "bad@mail.com"));
    }

    @Test
    void createContact_shouldThrow_whenEmailExists() {
        ContactDto dto = new ContactDto();
        ContactEmailDto emailDto = new ContactEmailDto();
        emailDto.setEmailAddress("dup@mail.com");
        dto.setEmails(List.of(emailDto));

        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.of(user));
        when(emailRepo.findByEmailAddressAndContact_User_Id(any(), anyLong()))
                .thenReturn(Optional.of(mock(ContactEmail.class)));

        assertThrows(InvalidActionException.class,
                () -> contactService.createContact(dto, user.getEmail()));
    }

    @Test
    void createContact_shouldThrow_whenPhoneExists() {
        ContactDto dto = new ContactDto();
        ContactPhoneDto phoneDto = new ContactPhoneDto();
        phoneDto.setPhoneNumber("999");
        dto.setPhones(List.of(phoneDto));

        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.of(user));
        when(phoneRepo.findByPhoneNumberAndContact_User_Id(any(), anyLong()))
                .thenReturn(Optional.of(mock(ContactPhone.class)));

        assertThrows(InvalidActionException.class,
                () -> contactService.createContact(dto, user.getEmail()));
    }


    // ============================GET CONTACT================================

    @Test
    void getContact_success() {
        Contact contact = new Contact();
        contact.setUser(user);

        when(contactRepo.findById(1L)).thenReturn(Optional.of(contact));
        when(contactMapper.toDto(contact))
                .thenReturn(new ContactResponseDto());

        ContactResponseDto result =
                contactService.getContact(1L, user.getEmail());

        assertNotNull(result);
    }

    @Test
    void getContact_shouldThrow_whenNotOwner() {
        User other = new User();
        other.setEmail("other@mail.com");

        Contact contact = new Contact();
        contact.setUser(other);

        when(contactRepo.findById(1L)).thenReturn(Optional.of(contact));

        assertThrows(InvalidActionException.class,
                () -> contactService.getContact(1L, user.getEmail()));
    }


    // =========================UPDATE CONTACT===================================

    @Test
    void updateContact_success() {
        Contact contact = new Contact();
        contact.setUser(user);
        contact.setEmails(new ArrayList<>());
        contact.setPhones(new ArrayList<>());

        ContactUpdateDto dto = new ContactUpdateDto();
        dto.setFirstName("Updated");

        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.of(user));
        when(contactRepo.findByIdAndUser(anyLong(), any()))
                .thenReturn(Optional.of(contact));
        when(contactRepo.save(any())).thenReturn(contact);
        when(contactMapper.toDto(any()))
                .thenReturn(new ContactResponseDto());

        ContactResponseDto result =
                contactService.updateContact(1L, user.getEmail(), dto);

        assertNotNull(result);
        verify(contactRepo).save(contact);
    }

    @Test
    void updateContact_shouldThrow_whenDuplicateEmail() {
        Contact contact = new Contact();
        contact.setUser(user);
        contact.setEmails(new ArrayList<>());
        contact.setPhones(new ArrayList<>());

        ContactUpdateDto dto = new ContactUpdateDto();

        ContactEmailDto e1 = new ContactEmailDto();
        e1.setEmailAddress("same@mail.com");

        ContactEmailDto e2 = new ContactEmailDto();
        e2.setEmailAddress("same@mail.com");

        dto.setEmails(List.of(e1, e2));

        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.of(user));
        when(contactRepo.findByIdAndUser(anyLong(), any()))
                .thenReturn(Optional.of(contact));

        assertThrows(InvalidActionException.class,
                () -> contactService.updateContact(1L, user.getEmail(), dto));
    }

    @Test
    void updateContact_shouldThrow_whenDuplicatePhone() {
        Contact contact = new Contact();
        contact.setUser(user);
        contact.setEmails(new ArrayList<>());
        contact.setPhones(new ArrayList<>());

        ContactUpdateDto dto = new ContactUpdateDto();

        ContactPhoneDto p1 = new ContactPhoneDto();
        p1.setPhoneNumber("111");

        ContactPhoneDto p2 = new ContactPhoneDto();
        p2.setPhoneNumber("111");

        dto.setPhones(List.of(p1, p2));

        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.of(user));
        when(contactRepo.findByIdAndUser(anyLong(), any()))
                .thenReturn(Optional.of(contact));

        assertThrows(InvalidActionException.class,
                () -> contactService.updateContact(1L, user.getEmail(), dto));
    }


    //============================== DELETE CONTACT=============================/

    @Test
    void deleteContact_success() {
        Contact contact = new Contact();
        contact.setUser(user);

        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.of(user));
        when(contactRepo.findByIdAndUser(anyLong(), any()))
                .thenReturn(Optional.of(contact));

        boolean result =
                contactService.deleteContact(1L, user.getEmail());

        assertTrue(result);
        verify(contactRepo).delete(contact);
    }

    @Test
    void deleteContact_shouldThrow_whenNotFound() {
        when(userRepo.findByEmailIgnoreCase(any()))
                .thenReturn(Optional.of(user));
        when(contactRepo.findByIdAndUser(anyLong(), any()))
                .thenReturn(Optional.empty());

        assertThrows(InvalidActionException.class,
                () -> contactService.deleteContact(1L, user.getEmail()));
    }


    //============================== CONTACT LIST=============================/


    @Test
    void contactList_success() {
        Contact contact = new Contact();
        Page<Contact> page = new PageImpl<>(List.of(contact));

        when(contactRepo.findUserContacts(any(), any(), any()))
                .thenReturn(page);
        when(contactMapper.toDto(any()))
                .thenReturn(new ContactResponseDto());

        Page<ContactResponseDto> result =
                contactService.contactList(user.getEmail(), "", PageRequest.of(0, 10));

        assertEquals(1, result.getContent().size());
    }
}
