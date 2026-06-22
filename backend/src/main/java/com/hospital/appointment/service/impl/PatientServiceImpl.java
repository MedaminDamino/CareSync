package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.PatientDTO;
import com.hospital.appointment.entity.Patient;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.Role;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.mapper.PatientMapper;
import com.hospital.appointment.repository.PatientRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(PatientMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return PatientMapper.toDTO(patient);
    }

    @Override
    @Transactional
    public PatientDTO createPatient(PatientDTO patientDTO) {
        if (userRepository.existsByEmail(patientDTO.getEmail())) {
            throw new BadRequestException("Email already exists: " + patientDTO.getEmail());
        }

        User user = User.builder()
                .email(patientDTO.getEmail())
                .password(passwordEncoder.encode("patient123")) // Default password for patient creation
                .role(Role.PATIENT)
                .build();
        userRepository.save(user);

        Patient patient = Patient.builder()
                .name(patientDTO.getName())
                .email(patientDTO.getEmail())
                .phone(patientDTO.getPhone())
                .dateOfBirth(patientDTO.getDateOfBirth())
                .user(user)
                .build();

        Patient savedPatient = patientRepository.save(patient);
        return PatientMapper.toDTO(savedPatient);
    }

    @Override
    @Transactional
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        if (!patient.getEmail().equalsIgnoreCase(patientDTO.getEmail()) && userRepository.existsByEmail(patientDTO.getEmail())) {
            throw new BadRequestException("Email already exists: " + patientDTO.getEmail());
        }

        patient.setName(patientDTO.getName());
        patient.setEmail(patientDTO.getEmail());
        patient.setPhone(patientDTO.getPhone());
        patient.setDateOfBirth(patientDTO.getDateOfBirth());

        User user = patient.getUser();
        if (user != null) {
            user.setEmail(patientDTO.getEmail());
            userRepository.save(user);
        }

        Patient updatedPatient = patientRepository.save(patient);
        return PatientMapper.toDTO(updatedPatient);
    }

    @Override
    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        
        patientRepository.delete(patient);
    }

    @Override
    public List<PatientDTO> getPatients(Boolean verified) {
        List<Patient> patients;
        if (verified != null) {
            patients = patientRepository.findByVerified(verified);
        } else {
            patients = patientRepository.findAll();
        }
        return patients.stream()
                .map(PatientMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PatientDTO verifyPatient(Long id, boolean verified) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patient.setVerified(verified);
        return PatientMapper.toDTO(patientRepository.save(patient));
    }
}
