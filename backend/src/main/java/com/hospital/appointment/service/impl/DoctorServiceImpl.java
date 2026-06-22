package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.DoctorDTO;
import com.hospital.appointment.entity.Doctor;
import com.hospital.appointment.entity.Speciality;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.Role;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.mapper.DoctorMapper;
import com.hospital.appointment.repository.DoctorRepository;
import com.hospital.appointment.repository.SpecialityRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpecialityRepository specialityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(DoctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> getDoctorsBySpeciality(Long specialityId) {
        return doctorRepository.findBySpecialityId(specialityId).stream()
                .map(DoctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return DoctorMapper.toDTO(doctor);
    }

    @Override
    @Transactional
    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        if (userRepository.existsByEmail(doctorDTO.getEmail())) {
            throw new BadRequestException("Email already exists: " + doctorDTO.getEmail());
        }

        Speciality speciality = specialityRepository.findById(doctorDTO.getSpeciality().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        User user = User.builder()
                .email(doctorDTO.getEmail())
                .password(passwordEncoder.encode("doctor123")) // Default password for created doctors
                .role(Role.DOCTOR)
                .build();
        userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .name(doctorDTO.getName())
                .email(doctorDTO.getEmail())
                .phone(doctorDTO.getPhone())
                .speciality(speciality)
                .user(user)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        return DoctorMapper.toDTO(savedDoctor);
    }

    @Override
    @Transactional
    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (!doctor.getEmail().equalsIgnoreCase(doctorDTO.getEmail()) && userRepository.existsByEmail(doctorDTO.getEmail())) {
            throw new BadRequestException("Email already exists: " + doctorDTO.getEmail());
        }

        Speciality speciality = specialityRepository.findById(doctorDTO.getSpeciality().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        doctor.setName(doctorDTO.getName());
        doctor.setEmail(doctorDTO.getEmail());
        doctor.setPhone(doctorDTO.getPhone());
        doctor.setSpeciality(speciality);

        User user = doctor.getUser();
        if (user != null) {
            user.setEmail(doctorDTO.getEmail());
            userRepository.save(user);
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return DoctorMapper.toDTO(updatedDoctor);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        
        doctorRepository.delete(doctor);
    }

    @Override
    public List<DoctorDTO> getDoctors(Long specialityId, Boolean verified) {
        List<Doctor> doctors;
        if (specialityId != null && verified != null) {
            doctors = doctorRepository.findBySpecialityIdAndVerified(specialityId, verified);
        } else if (specialityId != null) {
            doctors = doctorRepository.findBySpecialityId(specialityId);
        } else if (verified != null) {
            doctors = doctorRepository.findByVerified(verified);
        } else {
            doctors = doctorRepository.findAll();
        }
        return doctors.stream()
                .map(DoctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DoctorDTO verifyDoctor(Long id, boolean verified) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctor.setVerified(verified);
        return DoctorMapper.toDTO(doctorRepository.save(doctor));
    }
}
