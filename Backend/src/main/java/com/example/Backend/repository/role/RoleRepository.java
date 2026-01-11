package com.example.Backend.repository.role;

import com.example.Backend.entity.role.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {

    Optional<Role> findByRoleName(String roleName);
}




