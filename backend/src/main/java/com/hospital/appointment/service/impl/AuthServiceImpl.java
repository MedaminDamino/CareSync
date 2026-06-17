package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.AuthResponse;
import com.hospital.appointment.dto.LoginRequest;
import com.hospital.appointment.dto.RegisterRequest;
import com.hospital.appointment.entity.Doctor;
import com.hospital.appointment.entity.Patient;
import com.hospital.appointment.entity.Speciality;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.Role;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.repository.DoctorRepository;
import com.hospital.appointment.repository.PatientRepository;
import com.hospital.appointment.repository.SpecialityRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.security.JwtUtils;
import com.hospital.appointment.security.UserDetailsImpl;
import com.hospital.appointment.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private SpecialityRepository specialityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long profileId = null;
        if (user.getRole() == Role.DOCTOR) {
            profileId = doctorRepository.findByUserId(user.getId())
                    .map(Doctor::getId)
                    .orElse(null);
        } else if (user.getRole() == Role.PATIENT) {
            profileId = patientRepository.findByUserId(user.getId())
                    .map(Patient::getId)
                    .orElse(null);
        }

        return new AuthResponse(jwt, user.getEmail(), user.getRole(), profileId);
    }

    @Override
    @Transactional
    public void register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already taken!");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .build();

        userRepository.save(user);

        if (registerRequest.getRole() == Role.DOCTOR) {
            if (registerRequest.getSpecialityId() == null) {
                throw new BadRequestException("Doctor speciality is required!");
            }
            Speciality speciality = specialityRepository.findById(registerRequest.getSpecialityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

            Doctor doctor = Doctor.builder()
                    .name(registerRequest.getName())
                    .email(registerRequest.getEmail())
                    .phone(registerRequest.getPhone())
                    .speciality(speciality)
                    .user(user)
                    .build();

            doctorRepository.save(doctor);
        } else if (registerRequest.getRole() == Role.PATIENT) {
            if (registerRequest.getDateOfBirth() == null) {
                throw new BadRequestException("Patient date of birth is required!");
            }
            Patient patient = Patient.builder()
                    .name(registerRequest.getName())
                    .email(registerRequest.getEmail())
                    .phone(registerRequest.getPhone())
                    .dateOfBirth(registerRequest.getDateOfBirth())
                    .user(user)
                    .build();

            patientRepository.save(patient);
        } else {
            throw new BadRequestException("Invalid role registration requested!");
        }
    }
}
