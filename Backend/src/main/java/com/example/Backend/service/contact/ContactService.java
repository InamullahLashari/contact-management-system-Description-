package com.example.Backend.service.contact;

import com.example.Backend.dto.contact.ContactDto;
import com.example.Backend.dto.contact.ContactResponseDto;
import com.example.Backend.entity.contact.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactService {

    ContactResponseDto createContact(ContactDto contactDto , String email);
    Page<Contact> contactList(String keyword, Pageable pageable);
    ContactResponseDto updateContact(long id ,String email, ContactDto contactDto);
    boolean deleteContact(long id,String email);

}
