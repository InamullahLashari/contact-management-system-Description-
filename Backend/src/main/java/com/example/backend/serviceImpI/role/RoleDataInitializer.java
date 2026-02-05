package com.example.backend.serviceImpI.role;

import com.example.backend.entity.role.Role;
import com.example.backend.entity.roleEnum.RoleName;
import com.example.backend.repository.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleDataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        List<Role> existingRoles = roleRepository.findAll();
        Set<RoleName> existingRoleNames = existingRoles.stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());


        List<Role> rolesToInsert = new ArrayList<>();
        for (RoleName roleName : RoleName.values()) {
            if (!existingRoleNames.contains(roleName)) {
                rolesToInsert.add(new Role(roleName));
            }
        }


        if (!rolesToInsert.isEmpty()) {
            roleRepository.saveAll(rolesToInsert);
            System.out.println("Roles inserted automatically!");
        } else {
            System.out.println("All roles already exist. No insert needed.");
        }
    }
}
