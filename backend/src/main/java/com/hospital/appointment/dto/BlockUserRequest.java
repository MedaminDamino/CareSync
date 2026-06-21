package com.hospital.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockUserRequest {
    private String reason;  // POLICY_VIOLATION | INACTIVE_ACCOUNT | SECURITY_CONCERN | OTHER
    private String notes;
}
