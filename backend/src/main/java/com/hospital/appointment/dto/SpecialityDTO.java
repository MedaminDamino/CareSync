package com.hospital.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialityDTO {
    private Long id;

    @NotBlank(message = "Speciality name is required")
    private String name;

    private String description;
}
