package com.example.backend.service.contact;

import com.example.backend.dto.contact.ContactDto;
import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.dto.contact.ContactUpdateDto;
import com.example.backend.entity.contact.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactService {

    ContactResponseDto createContact(ContactDto contactDto, String email);

    Page<ContactResponseDto> contactList(String email, String keyword, Pageable pageable);

    ContactResponseDto updateContact(long id, String email, ContactUpdateDto UpdateDto);

    boolean deleteContact(long id, String email);

}
