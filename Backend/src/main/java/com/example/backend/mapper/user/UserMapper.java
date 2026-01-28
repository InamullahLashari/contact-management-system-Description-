package com.example.backend.mapper.user;
import com.example.backend.dto.user.UserRequestDto;
import com.example.backend.dto.user.UserResponseDto;
import com.example.backend.entity.user.User;

public class UserMapper {

public  static User toEntity(UserRequestDto userRequestDto) {

    User newUser = new User();
    newUser.setEmail(userRequestDto.getEmail());
    newUser.setPassword(userRequestDto.getPassword());
    newUser.setName(userRequestDto.getName());

    return newUser;

}
    public static UserResponseDto ToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRoleName(user.getRole().getRoleName().name());
        dto.setContacts(user.getContacts());  // optional
        dto.setGroups(user.getGroups());      // optional
        return dto;
    }


    }







