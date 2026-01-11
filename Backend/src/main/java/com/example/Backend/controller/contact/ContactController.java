package com.example.Backend.controller.contact;


import com.example.Backend.dto.contact.ContactDto;
import com.example.Backend.entity.contact.Contact;
import com.example.Backend.service.contact.ContactService;
import com.example.Backend.util.AuthenticationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
public ResponseEntity<?>addContact(@RequestBody ContactDto contactDto){
    log.info("addContact {}", contactDto);

    Contact newConatct= contactService.createContact(contactDto,authUtil.getEmail());

    log.info("authEmail {}", authUtil.getEmail());

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message","Contact add Succesfully",
            "status","Success",
            "ContactDto",newConatct



    ));














}






}
