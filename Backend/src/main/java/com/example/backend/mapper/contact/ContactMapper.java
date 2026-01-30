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
        ContactResponseDto dto = new ContactResponseDto();

        dto.setId(contact.getId());
        dto.setFirstName(contact.getFirstName());
        dto.setLastName(contact.getLastName());
        dto.setTitle(contact.getTitle());


        List<ContactEmailResponseDto> emailDtos = new ArrayList<>();
        for (ContactEmail email : contact.getEmails()) {
            ContactEmailResponseDto emailDto = new ContactEmailResponseDto();
            emailDto.setId(email.getId());
            emailDto.setLabel(email.getLabel());
            emailDto.setEmailAddress(email.getEmailAddress());
            emailDtos.add(emailDto);
        }
        dto.setEmails(emailDtos);


        List<ContactPhoneResponseDto> phoneDtos = new ArrayList<>();
        for (ContactPhone phone : contact.getPhones()) {
            ContactPhoneResponseDto phoneDto = new ContactPhoneResponseDto();
            phoneDto.setId(phone.getId());
            phoneDto.setLabel(phone.getLabel());
            phoneDto.setPhoneNumber(phone.getPhoneNumber());
            phoneDtos.add(phoneDto);
        }
        dto.setPhones(phoneDtos);

        return dto;
    }
}