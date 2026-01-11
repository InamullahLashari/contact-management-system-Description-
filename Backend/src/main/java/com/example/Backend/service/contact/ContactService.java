package com.example.Backend.service.contact;

import com.example.Backend.dto.contact.ContactDto;
import com.example.Backend.entity.contact.Contact;

public interface ContactService {

    Contact createContact(ContactDto contactDto , String email);
}
