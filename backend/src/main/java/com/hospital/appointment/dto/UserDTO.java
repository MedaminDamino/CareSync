package com.hospital.appointment.dto;

import com.hospital.appointment.enums.Role;
import com.hospital.appointment.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private Role role;
    private UserStatus status;
    private String blockReason;
    private LocalDateTime blockedAt;
    private Long blockedBy;
}

