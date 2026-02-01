package com.example.backend.dto.admin;

import com.example.backend.entity.roleEnum.RoleName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor  // Needed for Jackson
@AllArgsConstructor
public class UserResponseAdmin {

    private Long id;
    private String name;
    private String email;
    private String roleName;


    public UserResponseAdmin(Long id, String name, String email, RoleName roleName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.roleName = roleName.name(); // enum -> String
    }

}
