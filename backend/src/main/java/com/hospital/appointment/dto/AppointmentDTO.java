package com.hospital.appointment.dto;

import com.hospital.appointment.enums.AppointmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private Long id;

    @NotNull(message = "Doctor is required")
    private Long doctorId;
    private String doctorName;
    private String specialityName;

    @NotNull(message = "Patient is required")
    private Long patientId;
    private String patientName;

    @NotNull(message = "Appointment date and time are required")
    private LocalDateTime appointmentDate;

    @NotBlank(message = "Reason for appointment is required")
    private String reason;

    private AppointmentStatus status;
}
