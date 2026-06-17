package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.DoctorDTO;
import com.hospital.appointment.entity.Doctor;

public class DoctorMapper {
    public static DoctorDTO toDTO(Doctor doctor) {
        if (doctor == null) return null;
        return DoctorDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .speciality(SpecialityMapper.toDTO(doctor.getSpeciality()))
                .userId(doctor.getUser() != null ? doctor.getUser().getId() : null)
                .build();
    }

    public static Doctor toEntity(DoctorDTO dto) {
        if (dto == null) return null;
        return Doctor.builder()
                .id(dto.getId())
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .speciality(SpecialityMapper.toEntity(dto.getSpeciality()))
                .build();
    }
}
