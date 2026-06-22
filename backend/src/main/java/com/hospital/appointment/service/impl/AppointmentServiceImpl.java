package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.AppointmentDTO;
import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.Doctor;
import com.hospital.appointment.entity.Patient;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.AppointmentStatus;
import com.hospital.appointment.enums.Role;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.mapper.AppointmentMapper;
import com.hospital.appointment.repository.AppointmentRepository;
import com.hospital.appointment.repository.DoctorRepository;
import com.hospital.appointment.repository.PatientRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.AppointmentService;
import com.hospital.appointment.strategy.AppointmentStatusStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private List<AppointmentStatusStrategy> statusStrategies;

    private void checkAndCancelPastAppointments(List<Appointment> appointments) {
        LocalDateTime now = LocalDateTime.now();
        for (Appointment app : appointments) {
            if (app.getAppointmentDate().isBefore(now)
                    && app.getStatus() != AppointmentStatus.COMPLETED
                    && app.getStatus() != AppointmentStatus.CANCELLED
                    && app.getStatus() != AppointmentStatus.REJECTED) {
                app.setStatus(AppointmentStatus.CANCELLED);
                appointmentRepository.save(app);
            }
        }
    }

    @Override
    @Transactional
    public List<AppointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        checkAndCancelPastAppointments(appointments);
        return appointments.stream()
                .map(AppointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        checkAndCancelPastAppointments(appointments);
        return appointments.stream()
                .map(AppointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        checkAndCancelPastAppointments(appointments);
        return appointments.stream()
                .map(AppointmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        LocalDateTime now = LocalDateTime.now();
        if (appointment.getAppointmentDate().isBefore(now)
                && appointment.getStatus() != AppointmentStatus.COMPLETED
                && appointment.getStatus() != AppointmentStatus.CANCELLED
                && appointment.getStatus() != AppointmentStatus.REJECTED) {
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointment = appointmentRepository.save(appointment);
        }
        return AppointmentMapper.toDTO(appointment);
    }

    @Override
    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO appointmentDTO) {
        Doctor doctor = doctorRepository.findById(appointmentDTO.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + appointmentDTO.getDoctorId()));

        Patient patient = patientRepository.findById(appointmentDTO.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + appointmentDTO.getPatientId()));

        if (!patient.isVerified()) {
            throw new BadRequestException("Patient account must be verified to book an appointment!");
        }

        if (appointmentDTO.getAppointmentDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Appointment date cannot be in the past!");
        }

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDate(appointmentDTO.getAppointmentDate())
                .reason(appointmentDTO.getReason())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public AppointmentDTO updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        if (appointment.getStatus() == status) {
            return AppointmentMapper.toDTO(appointment);
        }

        // Fetch currently authenticated user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));

        if (currentUser.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found."));
            if (!doctor.isVerified()) {
                throw new BadRequestException("Doctor account must be verified to manage appointments!");
            }
        } else if (currentUser.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found."));
            if (!patient.isVerified()) {
                throw new BadRequestException("Patient account must be verified to manage appointments!");
            }
        }

        // Enforce transition logic via Strategy Pattern
        AppointmentStatusStrategy strategy = statusStrategies.stream()
                .filter(s -> s.getTargetStatus() == status)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid status transition requested."));

        strategy.execute(appointment, currentUser);

        Appointment updated = appointmentRepository.save(appointment);
        return AppointmentMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointmentRepository.delete(appointment);
    }
}
