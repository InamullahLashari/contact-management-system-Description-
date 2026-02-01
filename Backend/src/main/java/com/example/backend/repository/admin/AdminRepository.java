package com.example.backend.repository.admin;

import com.example.backend.entity.roleEnum.RoleName;
import com.example.backend.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<User, Long> {


    Page<User> findByRole_RoleNameAndNameContainingIgnoreCaseAndDeletedFalse(
            RoleName roleName, String name, Pageable pageable);

    Page<User> findByRole_RoleNameAndDeletedFalse(RoleName roleName, Pageable pageable);



}
