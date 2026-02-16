package com.example.backend.controller.contact;

import com.example.backend.dto.contact.ContactDto;
import com.example.backend.dto.contact.ContactResponseDto;
import com.example.backend.dto.contact.ContactUpdateDto;
import com.example.backend.service.contact.ContactService;
import com.example.backend.util.AuthenticationUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ContactControllerTest {

    @InjectMocks
    private ContactController contactController;

    @Mock
    private ContactService contactService;

    @Mock
    private AuthenticationUtil authUtil;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(contactController).build();
    }

    @Test
    void addContact_shouldReturnCreated() throws Exception {
        ContactDto dto = new ContactDto();
        dto.setFirstName("John");

        ContactResponseDto responseDto = new ContactResponseDto();
        responseDto.setId(1L);
        responseDto.setFirstName("John");

        when(authUtil.getEmail()).thenReturn("test@mail.com");
        when(contactService.createContact(Mockito.any(ContactDto.class), Mockito.anyString()))
                .thenReturn(responseDto);

        mockMvc.perform(post("/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Success"))
                .andExpect(jsonPath("$.message").value("Contact add Succesfully"))
                .andExpect(jsonPath("$.ContactDto.id").value(1L))
                .andExpect(jsonPath("$.ContactDto.firstName").value("John"));
    }

    @Test
    void listContacts_shouldReturnPaginatedContacts() throws Exception {
        ContactResponseDto contact = new ContactResponseDto();
        contact.setId(1L);
        contact.setFirstName("Alice");

        Page<ContactResponseDto> page = new PageImpl<>(
                List.of(contact),
                PageRequest.of(0, 10, Sort.by("firstName").ascending()),
                1
        );

        when(authUtil.getEmail()).thenReturn("test@mail.com");
        when(contactService.contactList(Mockito.anyString(), Mockito.any(), Mockito.any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/contact/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.contacts", hasSize(1)))
                .andExpect(jsonPath("$.contacts[0].firstName").value("Alice"))
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.currentPage").value(0))
                .andExpect(jsonPath("$.totalPages").value(1));
    }

    @Test
    void updateContact_shouldReturnUpdatedContact() throws Exception {
        ContactUpdateDto updateDto = new ContactUpdateDto();
        updateDto.setId(1L);
        updateDto.setFirstName("UpdatedName");

        ContactResponseDto responseDto = new ContactResponseDto();
        responseDto.setId(1L);
        responseDto.setFirstName("UpdatedName");

        when(authUtil.getEmail()).thenReturn("test@mail.com");
        when(contactService.updateContact(Mockito.eq(1L), Mockito.anyString(), Mockito.any(ContactUpdateDto.class)))
                .thenReturn(responseDto);

        mockMvc.perform(put("/contact/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Success"))
                .andExpect(jsonPath("$.message").value("Updated successfully"))
                .andExpect(jsonPath("$.contact.id").value(1L))
                .andExpect(jsonPath("$.contact.firstName").value("UpdatedName"));
    }

    @Test
    void deleteContact_shouldReturnSuccess() throws Exception {
        when(authUtil.getEmail()).thenReturn("test@mail.com");
        when(contactService.deleteContact(Mockito.eq(1L), Mockito.anyString())).thenReturn(true);

        mockMvc.perform(delete("/contact/contacts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Success"))
                .andExpect(jsonPath("$.message").value("Deleted successfully"));
    }
}
