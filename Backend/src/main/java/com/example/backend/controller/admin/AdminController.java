package com.example.backend.controller.admin;


import com.example.backend.dto.ApIResponse.ApiResponse;
import com.example.backend.dto.admin.UserResponseAdmin;
import com.example.backend.service.admin.AdminService;
import com.example.backend.util.AuthenticationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/admin")
public class AdminController
{

    @Autowired
 private AuthenticationUtil authUtil;
@Autowired
private AdminService adminService;




    @GetMapping()
    public ResponseEntity<?> userList(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {

        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        String email = authUtil.getEmail();
        log.info("Admin email: {}", email);

        Page<UserResponseAdmin> users = adminService.UserList(email, pageRequest, keyword);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Contacts fetched successfully");
        response.put("User", users.getContent());
        response.put("currentPage", users.getNumber());
        response.put("totalItems", users.getTotalElements());
        response.put("totalPages", users.getTotalPages());

        return ResponseEntity.ok(response);

    }


    @DeleteMapping()
    public ResponseEntity<?>deleteUser(@RequestParam String email)
    {
     boolean status = adminService.deleteUser(authUtil.getEmail(), email);

        log.info("status {}", status);
        return ResponseEntity.ok(Map.of(
                "status", "Success",
                "message", "Deleted successfully"
        ));
    }




}


