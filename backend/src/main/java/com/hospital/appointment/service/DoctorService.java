package com.hospital.appointment.service;

import com.hospital.appointment.dto.DoctorDTO;
import java.util.List;

public interface DoctorService {
    List<DoctorDTO> getAllDoctors();
    List<DoctorDTO> getDoctorsBySpeciality(Long specialityId);
    DoctorDTO getDoctorById(Long id);
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO);
    void deleteDoctor(Long id);
}
