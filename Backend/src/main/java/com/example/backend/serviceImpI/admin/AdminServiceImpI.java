package com.example.backend.serviceImpI.admin;

import com.example.backend.dto.admin.UserResponseAdmin;
import com.example.backend.entity.roleEnum.RoleName;
import com.example.backend.entity.user.User;
import com.example.backend.mapper.admin.AdminMapper;
import com.example.backend.repository.admin.AdminRepository;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.service.admin.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpI implements AdminService {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private UserRepository userRepository;
 @Autowired
    private AdminMapper adminMapper ;





 private User getUser(String email){
     return  userRepository.findByEmailIgnoreCase(email).
             orElseThrow(()-> new EntityNotFoundException("Admin not found"));
 }

    @Override
    public Page<UserResponseAdmin> UserList(String email, PageRequest pageRequest, String search) {


            User admin = getUser(email);
            if (admin.getRole().getRoleName() != RoleName.ROLE_ADMIN) {
                throw new RuntimeException("Access denied: Not an admin");
            }

            // Fetch users
            Page<User> userPage;
            if (search != null && !search.trim().isEmpty()) {
                userPage = adminRepository.findByRole_RoleNameAndNameContainingIgnoreCaseAndDeletedFalse(RoleName.ROLE_USER,search, pageRequest);
            } else {
                userPage = adminRepository.findByRole_RoleNameAndDeletedFalse(RoleName.ROLE_USER,pageRequest);
            }

            // Map to DTO
            return userPage.map(adminMapper::toUserResponseAdmin);

        }
//================================delete user==========================
    @Override
    public boolean deleteUser(String authEmail,String email) {

     User admin = getUser(authEmail);
        if (admin.getRole().getRoleName() != RoleName.ROLE_ADMIN) {
            throw new RuntimeException("Access denied: Only admin can delete users");
        }

        if (authEmail.equalsIgnoreCase(email)) {
            throw new RuntimeException("Admin cannot delete himself");
        }
      User user = getUser(email);

     if(user.isDeleted()){
         throw new RuntimeException("Access denied: User already deleted");
     }

     user.setDeleted(true);
     userRepository.save(user);

        return true;
    }

}



