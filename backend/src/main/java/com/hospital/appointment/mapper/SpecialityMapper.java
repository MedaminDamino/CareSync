package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.SpecialityDTO;
import com.hospital.appointment.entity.Speciality;

public class SpecialityMapper {
    public static SpecialityDTO toDTO(Speciality speciality) {
        if (speciality == null) return null;
        return SpecialityDTO.builder()
                .id(speciality.getId())
                .name(speciality.getName())
                .description(speciality.getDescription())
                .build();
    }

    public static Speciality toEntity(SpecialityDTO dto) {
        if (dto == null) return null;
        return Speciality.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }
}
