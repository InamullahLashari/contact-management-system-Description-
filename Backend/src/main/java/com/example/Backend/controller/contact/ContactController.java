package com.example.Backend.controller.contact;


import com.example.Backend.dto.contact.ContactDto;
import com.example.Backend.dto.contact.ContactResponseDto;
import com.example.Backend.dto.email.ContactEmailDto;
import com.example.Backend.dto.phone.ContactPhoneDto;
import com.example.Backend.entity.contact.Contact;
import com.example.Backend.service.contact.ContactService;
import com.example.Backend.util.AuthenticationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private AuthenticationUtil authUtil;


    //=======================================ADD Contact=======================================//
    @PostMapping
    public ResponseEntity<?> addContact(@RequestBody ContactDto contactDto) {
        log.info("addContact {}", contactDto);

        ContactResponseDto newConatct = contactService.createContact(contactDto, authUtil.getEmail());

        log.info("authEmail {}", authUtil.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Contact add Succesfully",
                "status", "Success",
                "ContactDto", newConatct


        ));
    }

    //====================================Pagination===================================================//
    @PostMapping("/list")
    public ResponseEntity<?> contactList(
            @RequestParam(required = false) String keywords,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {


        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Contact> contacts = contactService.contactList(keywords, pageable);




        var newContacts = contacts.getContent().stream()
                .map(c -> Map.of(
                        "id", c.getId(),
                        "firstName", c.getFirstName(),
                        "lastName", c.getLastName(),
                        "title", c.getTitle(),
                        "emails", c.getEmails().stream()
                                .map(e -> {
                                    ContactEmailDto dto = new ContactEmailDto();
                                    dto.setEmailAddress(e.getEmailAddress());
                                    dto.setLabel(e.getLabel());
                                    return dto;
                                }).toList(),
                        "phones", c.getPhones().stream()
                                .map(p -> {
                                    ContactPhoneDto dto = new ContactPhoneDto();
                                    dto.setPhoneNumber(p.getPhoneNumber());
                                    dto.setLabel(p.getLabel());
                                    return dto;
                                }).toList()
                ))
                .toList();


        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Contacts fetched successfully");
        response.put("contacts", newContacts);
        response.put("currentPage", contacts.getNumber());
        response.put("totalItems", contacts.getTotalElements());
        response.put("totalPages", contacts.getTotalPages());
        return ResponseEntity.ok(response);
    }


  //==================================update conatct==============================================//

    @PutMapping("/update")
    public ResponseEntity<?> updateContact(@RequestBody ContactDto contactDto) {
        log.info("Updating contact: {}", contactDto);

        long id = contactDto.getId();
        ContactResponseDto updatedContact = contactService.updateContact(id, authUtil.getEmail(), contactDto);

        log.info("Authenticated user: {}", authUtil.getEmail());

        return ResponseEntity.ok(Map.of(
                "status", "Success",
                "message", "Updated successfully",
                "contact", updatedContact
        ));
    }

    //==================================Delete conatct==============================================//

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable long id) {
        log.info("Deleting contact: {}", id);

        Boolean status = contactService.deleteContact(id, authUtil.getEmail());
        log.info("Authenticated user: {}", authUtil.getEmail());

        log.info("status {}", status);
        return ResponseEntity.ok(Map.of(
                "status", "Success",
                "message", "Deleted successfully"
        ));
    }





}






