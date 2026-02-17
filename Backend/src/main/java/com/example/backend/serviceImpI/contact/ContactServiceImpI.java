
package com.example.backend.serviceImpI.contact;
import com.example.backend.dto.contact.ContactDto;
import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.dto.contact.ContactUpdateDto;
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
import java.util.*;


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
        Set<String> emailSet = new HashSet<>();

        if (contactEmailDtos != null && !contactEmailDtos.isEmpty()) {

            for (ContactEmailDto emailDto : contactEmailDtos) {
                String emailLower = emailDto.getEmailAddress().toLowerCase();

                // Check duplicates in the same request
                if (!emailSet.add(emailLower)) {
                    throw new InvalidActionException("Duplicate email in request: " + emailDto.getEmailAddress());
                }

                // Check duplicates in DB
                emailRepo.findByEmailAddressAndContact_User_Id(emailDto.getEmailAddress(), User_Id)
                        .ifPresent(e -> {
                            throw new InvalidActionException("Email exists: " + e.getEmailAddress());
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
        Set<String> phoneSet = new HashSet<>();

        if (contactPhoneDtos != null && !contactPhoneDtos.isEmpty()) {

            for (ContactPhoneDto phoneDto : contactPhoneDtos) {

                // Check duplicates in request
                if (!phoneSet.add(phoneDto.getPhoneNumber())) {
                    throw new InvalidActionException("Duplicate phone in request: " + phoneDto.getPhoneNumber());
                }

                // Check duplicates in DB
                phoneRepo.findByPhoneNumberAndContact_User_Id(phoneDto.getPhoneNumber(), User_Id)
                        .ifPresent(p -> {
                            throw new InvalidActionException("Phone exists: " + p.getPhoneNumber());
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
    public ContactResponseDto updateContact(long id, String email, ContactUpdateDto dto) {

        //  Get user
        User user = getUser(email);

        //  Fetch contact for this user
        Contact contact = contactRepo.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new InvalidActionException("User can't update another user's contact"));
        // Overwrite basic fields
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setTitle(dto.getTitle());

        // ---- Emails ----
        if (dto.getEmails() != null && !dto.getEmails().isEmpty()) {
            // Clear existing emails
            contact.getEmails().clear();

            // Check for duplicates
            Set<String> emailSet = new HashSet<>();
            for (ContactEmailDto emailObj : dto.getEmails()) {
                if (!emailSet.add(emailObj.getEmailAddress().toLowerCase())) {
                    throw new InvalidActionException("Duplicate email found: " + emailObj.getEmailAddress());
                }
            }


            contact.getEmails().clear();
            for (ContactEmailDto emailObj : dto.getEmails()) {
                ContactEmail contactEmail = new ContactEmail();
                contactEmail.setEmailAddress(emailObj.getEmailAddress());
                contactEmail.setLabel(emailObj.getLabel());
                contactEmail.setContact(contact);
                contact.getEmails().add(contactEmail); //
            }
        }

        // ---- Phones ----
        if (dto.getPhones() != null && !dto.getPhones().isEmpty()) {
            // Clear existing phones
            contact.getPhones().clear();

            // Check for duplicates
            Set<String> phoneSet = new HashSet<>();
            for (ContactPhoneDto phone : dto.getPhones()) {
                if (!phoneSet.add(phone.getPhoneNumber())) {
                    throw new InvalidActionException("Duplicate phone number found: " + phone.getPhoneNumber());
                }
            }

            // Map DTO to entity and link to parent contact

            for (ContactPhoneDto phoneDto : dto.getPhones()) {
                ContactPhone contactPhone = new ContactPhone();
                contactPhone.setPhoneNumber(phoneDto.getPhoneNumber());
                contactPhone.setLabel(phoneDto.getLabel());
                contactPhone.setContact(contact); //
                contact.getPhones().add(contactPhone);
            }

        }

        //  Save updated contact
        Contact updated = contactRepo.save(contact);

        log.info("User {} updated contact {}", email, updated.getId());

        // Return DTO
        return contactMapper.toDto(updated);
    }



        //================================================Delete Contact=======================================//

    @Transactional
    @Override
    public boolean deleteContact(long id, String email) {

        User user = getUser(email);


        Contact contact = contactRepo.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new InvalidActionException("Contact not found or user can't delete another user's contact"));

        contactRepo.delete(contact);

        log.info("User {} deleted contact {}", email, id);
        return true;
    }

}


