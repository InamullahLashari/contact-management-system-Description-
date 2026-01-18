package com.example.Backend.dto.phone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupWithPhonesDto {
    private String groupName;
    private Set<PhoneWithContactDto> phones; // all phones in the group
}
