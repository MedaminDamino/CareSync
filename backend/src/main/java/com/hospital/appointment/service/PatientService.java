package com.hospital.appointment.service;

import com.hospital.appointment.dto.PatientDTO;
import java.util.List;

public interface PatientService {
    List<PatientDTO> getAllPatients();
    List<PatientDTO> getPatients(Boolean verified);
    PatientDTO getPatientById(Long id);
    PatientDTO createPatient(PatientDTO patientDTO);
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    PatientDTO verifyPatient(Long id, boolean verified);
    void deletePatient(Long id);
}
