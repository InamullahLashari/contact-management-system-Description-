package com.example.backend.service.contact;

import com.example.backend.dto.contact.ContactDto;
import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.entity.contact.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactService {

    ContactResponseDto createContact(ContactDto contactDto, String email);

    Page<Contact> contactList(String keyword, Pageable pageable);

    ContactResponseDto updateContact(long id, String email, ContactDto contactDto);

    boolean deleteContact(long id, String email);

}
