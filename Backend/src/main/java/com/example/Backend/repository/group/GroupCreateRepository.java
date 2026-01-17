package com.example.Backend.repository.group;

import com.example.Backend.entity.group.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupCreateRepository extends JpaRepository<Group,Long> {


   Optional<Group> findByGroupName(String groupName);




}




