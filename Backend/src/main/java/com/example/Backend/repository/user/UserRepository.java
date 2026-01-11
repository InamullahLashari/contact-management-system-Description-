package com.example.Backend.repository.user;

import com.example.Backend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Long> {


    Optional<User> findByEmailIgnoreCase(String email);


}
