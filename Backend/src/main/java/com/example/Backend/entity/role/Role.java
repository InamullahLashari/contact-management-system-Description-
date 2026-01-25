package com.example.Backend.entity.role;

import com.example.Backend.entity.roleEnum.RoleName;
import jakarta.persistence.*;
import lombok.*;
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", nullable = false, unique = true)
    private RoleName roleName;

    public Role(RoleName roleName) {
        this.roleName = roleName;
    }

}
