package com.example.Backend.repository.group;

import com.example.Backend.entity.group.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.Set;

public interface GroupCreateRepository extends JpaRepository<Group,Long> {

/// ///fecth the group by user
Set<Group> findByUser_Id(Long id);

    Optional<Group> findByGroupNameAndUserId(String groupName, Long userId);


}




