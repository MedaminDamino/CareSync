package com.hospital.appointment.service;

import com.hospital.appointment.dto.SpecialityDTO;
import java.util.List;

public interface SpecialityService {
    List<SpecialityDTO> getAllSpecialities();
    SpecialityDTO getSpecialityById(Long id);
    SpecialityDTO createSpeciality(SpecialityDTO specialityDTO);
    SpecialityDTO updateSpeciality(Long id, SpecialityDTO specialityDTO);
    void deleteSpeciality(Long id);
}
