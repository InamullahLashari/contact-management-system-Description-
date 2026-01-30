package com.example.backend.mapper.contact;

import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.dto.email.ContactEmailResponseDto;
import com.example.backend.dto.phone.ContactPhoneResponseDto;
import com.example.backend.entity.contact.Contact;
import com.example.backend.entity.contactemail.ContactEmail;
import com.example.backend.entity.contactphone.ContactPhone;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ContactMapper {


    public ContactResponseDto toDto(Contact contact) {

        ContactResponseDto contactResponseDto = new ContactResponseDto();

        contactResponseDto.setId(contact.getId());
        contactResponseDto.setFirstName(contact.getFirstName());
        contactResponseDto.setLastName(contact.getLastName());
        contactResponseDto.setTitle(contact.getTitle());
        List<ContactEmailResponseDto> Emails = new ArrayList<>();

        for (ContactEmail contactEmail : contact.getEmails()) {
            ContactEmailResponseDto Emaildto = new ContactEmailResponseDto();
            Emaildto.setId(contactEmail.getId());
            Emaildto.setLabel(contactEmail.getLabel());
            Emaildto.setEmailAddress(contactEmail.getEmailAddress());
            Emails.add(Emaildto);
        }
        contactResponseDto.setEmails(Emails);

        List<ContactPhoneResponseDto> Phones = new ArrayList<>();

        for (ContactPhone contactPhones : contact.getPhones()) {

            ContactPhoneResponseDto PhoneDto = new ContactPhoneResponseDto();

            PhoneDto.setId(contactPhones.getId());
            PhoneDto.setLabel(contactPhones.getLabel());
            PhoneDto.setPhoneNumber(contactPhones.getPhoneNumber());
            Phones.add(PhoneDto);

        }
        contactResponseDto.setPhones(Phones);

        return contactResponseDto;


    }
}
