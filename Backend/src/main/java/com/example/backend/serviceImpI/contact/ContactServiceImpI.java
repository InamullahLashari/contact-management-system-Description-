package com.example.backend.serviceImpI.contact;

import com.example.backend.dto.contact.ContactDto;
import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.dto.email.ContactEmailDto;
import com.example.backend.dto.email.ContactEmailResponseDto;
import com.example.backend.dto.phone.ContactPhoneDto;
import com.example.backend.dto.phone.ContactPhoneResponseDto;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.contactemail.ContactEmail;
import com.example.backend.entity.contactphone.ContactPhone;
import com.example.backend.entity.user.User;
import com.example.backend.exception.InvalidActionException;
import com.example.backend.repository.contact.ContactRepository;
import com.example.backend.repository.email.EmailRepository;
import com.example.backend.repository.phone.PhoneRepository;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.service.contact.ContactService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ContactServiceImpI implements ContactService {

    private final PhoneRepository phoneRepo;
    private final UserRepository userRepo;
    private final EmailRepository emailRepo;
    private final ContactRepository contactRepo;

    public ContactServiceImpI(PhoneRepository phoneRepo,
                              UserRepository userRepo,
                              EmailRepository emailRepo,
                              ContactRepository contactRepo) {
        this.phoneRepo = phoneRepo;
        this.userRepo = userRepo;
        this.emailRepo = emailRepo;
        this.contactRepo = contactRepo;
    }

    //================================================Add Contact=======================================//
    @Override
    public ContactResponseDto createContact(ContactDto contactDto, String email) {

        User user = getUser(email);

        Contact contact = new Contact();
        contact.setFirstName(contactDto.getFirstName());
        contact.setLastName(contactDto.getLastName());
        contact.setTitle(contactDto.getTitle());
        contact.setUser(user);

        List<ContactEmail> newEmail = processEmail(contactDto.getEmails(), contact);

        List<ContactPhone> newPhone = processPhone(contactDto.getPhones(), contact);

        contact.setEmails(newEmail);
        contact.setPhones(newPhone);
        Contact saved = contactRepo.save(contact);

        return toResponseDto(saved); //here i call helperx function

    }
   //----------------------helper function-------------------------------//
   private ContactResponseDto toResponseDto(Contact contact) {

       ContactResponseDto dto = new ContactResponseDto();
       dto.setId(contact.getId());
       dto.setFirstName(contact.getFirstName());
       dto.setLastName(contact.getLastName());
       dto.setTitle(contact.getTitle());

       dto.setEmails(
               contact.getEmails().stream()
                       .map(e -> new ContactEmailResponseDto(
                               e.getId(),
                               e.getEmailAddress(),
                               e.getLabel()
                       ))
                       .toList()
       );

       dto.setPhones(
               contact.getPhones().stream()
                       .map(p -> new ContactPhoneResponseDto(
                               p.getId(),
                               p.getPhoneNumber(),
                               p.getLabel()
                       ))
                       .toList()
       );

       return dto;
   }


    //-----------------------------get User------------------------//

    private User getUser(String email) {
        return userRepo.findByEmailIgnoreCase(email).orElseThrow(() -> new EntityNotFoundException());

    }


    //--------------------------process Email------------------------//

    private List<ContactEmail> processEmail(
            List<ContactEmailDto> contactEmailDtos,
            Contact contact) {

        List<ContactEmail> contactEmails = new ArrayList<>();

        if (contactEmailDtos != null && !contactEmailDtos.isEmpty()) {

            for (ContactEmailDto emailDto : contactEmailDtos) {

                emailRepo.findByEmailAddress(emailDto.getEmailAddress())
                        .ifPresent(e -> {
                            throw new InvalidActionException(
                                    "Email exists: " + e.getEmailAddress()
                            );
                        });
                ContactEmail contactEmail = new ContactEmail();
                contactEmail.setEmailAddress(emailDto.getEmailAddress());
                contactEmail.setLabel(emailDto.getLabel());
                contactEmail.setContact(contact);

                contactEmails.add(contactEmail);
            }
        }
        return contactEmails;
    }


    //----------------------------Process phone------------------------//
    private List<ContactPhone> processPhone(
            List<ContactPhoneDto> contactPhoneDtos,
            Contact contact) {

        List<ContactPhone> contactPhones = new ArrayList<>();

        if (contactPhoneDtos != null && !contactPhoneDtos.isEmpty()) {

            for (ContactPhoneDto phoneDto : contactPhoneDtos) {

                phoneRepo.findByPhoneNumber(phoneDto.getPhoneNumber())
                        .ifPresent(p -> {
                            throw new InvalidActionException(
                                    "PhoneNo exists: " + p.getPhoneNumber()
                            );
                        });

                ContactPhone phone = new ContactPhone();
                phone.setPhoneNumber(phoneDto.getPhoneNumber());
                phone.setLabel(phoneDto.getLabel());
                phone.setContact(contact);

                contactPhones.add(phone);
            }
        }

        return contactPhones;
    }

    //---------------------------mapper Contact-----------------------//
    private Contact mapDtoToContact(ContactDto contactDto, User newUser) {

        Contact newContact = new Contact();
        newContact.setFirstName(contactDto.getFirstName());
        newContact.setLastName(contactDto.getLastName());
        newContact.setTitle(contactDto.getTitle());
        newContact.setUser(newUser);
        return newContact;

    }


    //================================================Pagenation  Contact=======================================//



    @Override
    public Page<Contact> contactList(String keyword, Pageable pageable) {
        return (keyword == null || keyword.isBlank())
                ? contactRepo.findAll(pageable)
                : contactRepo.searchContacts(keyword, pageable);
    }





    //================================================update Contact=======================================//

    @Override
    public ContactResponseDto updateContact(long id, String email, ContactDto dto) {

        User user = getUser(email);

        Contact contact = contactRepo.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new InvalidActionException("User can't update another user's contact"));

        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setTitle(dto.getTitle());

        contact.getEmails().clear();
        contact.getPhones().clear();

        contact.getEmails().addAll(processEmail(dto.getEmails(), contact));
        contact.getPhones().addAll(processPhone(dto.getPhones(), contact));

        Contact updated = contactRepo.save(contact);

        log.info("User {} updated contact {}", email, updated.getId());

        return toResponseDto(updated);
    }

    //================================================Delete Contact=======================================//

    @Transactional
    @Override
    public boolean deleteContact(long id, String email) {

        User user = getUser(email);

        Contact contact = contactRepo.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new InvalidActionException("User can't delete another user's contact"));

        contactRepo.delete(contact);

        log.info("User {} deleted contact {}", email, id);
        return true;
    }

}