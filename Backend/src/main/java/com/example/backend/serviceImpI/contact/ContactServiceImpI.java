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
import com.example.backend.mapper.contact.ContactMapper;
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
    private final ContactMapper contactMapper;

    public ContactServiceImpI(PhoneRepository phoneRepo,
                              UserRepository userRepo,
                              EmailRepository emailRepo,
                              ContactRepository contactRepo, ContactMapper contactMapper) {
        this.phoneRepo = phoneRepo;
        this.userRepo = userRepo;
        this.emailRepo = emailRepo;
        this.contactRepo = contactRepo;
        this.contactMapper = contactMapper;
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

        List<ContactEmail> newEmail = processEmail(contactDto.getEmails(), contact, user.getId());

        List<ContactPhone> newPhone = processPhone(contactDto.getPhones(), contact, user.getId());

        contact.setEmails(newEmail);
        contact.setPhones(newPhone);
        Contact saved = contactRepo.save(contact);

        return contactMapper.toDto(saved); //here i call helperx function

    }

    //-----------------------------get User------------------------//

    private User getUser(String email) {
        return userRepo.findByEmailIgnoreCase(email).orElseThrow(() -> new EntityNotFoundException("user not found"));

    }

    //--------------------------process Email------------------------//

    private List<ContactEmail> processEmail(
            List<ContactEmailDto> contactEmailDtos,
            Contact contact, Long User_Id) {

        List<ContactEmail> contactEmails = new ArrayList<>();

        if (contactEmailDtos != null && !contactEmailDtos.isEmpty()) {

            for (ContactEmailDto emailDto : contactEmailDtos) {

                emailRepo.findByEmailAddressAndContact_User_Id(emailDto.getEmailAddress(), User_Id)
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
            Contact contact, Long User_Id) {

        List<ContactPhone> contactPhones = new ArrayList<>();

        if (contactPhoneDtos != null && !contactPhoneDtos.isEmpty()) {

            for (ContactPhoneDto phoneDto : contactPhoneDtos) {

                phoneRepo.findByPhoneNumberAndContact_User_Id(phoneDto.getPhoneNumber(), User_Id)
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


    //================================================Pagenation  Contact=======================================//


    @Override
    public Page<ContactResponseDto> contactList(String email, String keyword, Pageable pageable) {
        return contactRepo.findUserContacts(email, keyword, pageable)
                .map(contactMapper::toDto); // convert entity → DTO
    }

    public ContactResponseDto getContact(Long contactId, String email) {
        Contact contact = contactRepo.findById(contactId)
                .filter(c -> c.getUser().getEmail().equalsIgnoreCase(email))
                .orElseThrow(() -> new InvalidActionException("Contact not found or not owned by user"));

        return contactMapper.toDto(contact);
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

//        contact.getEmails().addAll(processEmail(dto.getEmails(), contact));
//        contact.getPhones().addAll(processPhone(dto.getPhones(), contact));

        Contact updated = contactRepo.save(contact);

        log.info("User {} updated contact {}", email, updated.getId());

//        return toResponseDto(updated);
        return null;
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


