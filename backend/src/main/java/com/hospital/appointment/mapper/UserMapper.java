package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.entity.User;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .blockReason(user.getBlockReason())
                .blockedAt(user.getBlockedAt())
                .blockedBy(user.getBlockedBy())
                .build();
    }
}

