package com.example.Backend.serviceImpI.contact;

import com.example.Backend.dto.contact.ContactDto;
import com.example.Backend.dto.email.ContactEmailDto;
import com.example.Backend.dto.phone.ContactPhoneDto;
import com.example.Backend.entity.contact.Contact;
import com.example.Backend.entity.contactemail.ContactEmail;
import com.example.Backend.entity.contactphone.ContactPhone;
import com.example.Backend.entity.user.User;
import com.example.Backend.exception.InvalidActionException;
import com.example.Backend.repository.contact.ContactRepository;
import com.example.Backend.repository.email.EmailRepository;
import com.example.Backend.repository.phone.PhoneRepository;
import com.example.Backend.repository.user.UserRepository;
import com.example.Backend.service.contact.ContactService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ContactServiceImpI implements ContactService {

    @Autowired
    private PhoneRepository phoneRepo;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private EmailRepository emailRepo;
    @Autowired
    private ContactRepository contactRepo;


    //================================================Add Contact=======================================//
    @Override
    public Contact createContact(ContactDto contactDto, String email) {

        User newUser = getUser(email);

        Contact Addcontact = mapDtoToContact(contactDto, newUser);

        List<ContactEmail> newEmail = processEmail(contactDto.getEmails(), Addcontact);

        List<ContactPhone> newPhone = processPhone(contactDto.getPhones(), Addcontact);

        Addcontact.setEmails(newEmail);
        Addcontact.setPhones(newPhone);

        return contactRepo.save(Addcontact);

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
        if (keyword == null || keyword.isEmpty()) {
            return contactRepo.findAll(pageable);
        } else {
            return contactRepo.searchContacts(keyword, pageable);

        }

    }

    //================================================update Contact=======================================//
    @Override
    public Contact updateContact(long id, String email, ContactDto contactDto) {

        User user = userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("user not found"));

        Contact updateContact = contactRepo.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new InvalidActionException("User can't change contact of other user"));

        updateContact.setFirstName(contactDto.getFirstName());
        updateContact.setLastName(contactDto.getLastName());
        updateContact.setTitle(contactDto.getTitle());

        updateContact.getEmails().clear();
        updateContact.getPhones().clear();

        updateContact.getEmails().addAll(
                processEmail(contactDto.getEmails(), updateContact)
        );
        updateContact.getPhones().addAll(
                processPhone(contactDto.getPhones(), updateContact)
        );

        return contactRepo.save(updateContact);
    }



    //================================================Delete Contact=======================================//
    @Transactional
    @Override
    public boolean deleteContact(long id, String email) {


        User user = userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Contact contact = contactRepo.findByIdAndUser(id, user)
                .orElseThrow(() -> new InvalidActionException("User can't delete contact of other user"));

        contactRepo.delete(contact);


        log.info("User {} deleted contact {}", user.getEmail(), contact.getId());


        return true;
    }


}