package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.PatientDTO;
import com.hospital.appointment.entity.Patient;

public class PatientMapper {
    public static PatientDTO toDTO(Patient patient) {
        if (patient == null) return null;
        return PatientDTO.builder()
                .id(patient.getId())
                .name(patient.getName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .dateOfBirth(patient.getDateOfBirth())
                .userId(patient.getUser() != null ? patient.getUser().getId() : null)
                .build();
    }

    public static Patient toEntity(PatientDTO dto) {
        if (dto == null) return null;
        return Patient.builder()
                .id(dto.getId())
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .dateOfBirth(dto.getDateOfBirth())
                .build();
    }
}
