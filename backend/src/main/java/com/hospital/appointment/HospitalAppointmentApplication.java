package com.hospital.appointment;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.Doctor;
import com.hospital.appointment.entity.Patient;
import com.hospital.appointment.entity.Speciality;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.AppointmentStatus;
import com.hospital.appointment.enums.Role;
import com.hospital.appointment.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class HospitalAppointmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalAppointmentApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            SpecialityRepository specialityRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Seed admin if not present
            if (!userRepository.existsByEmail("admin@hospital.com")) {
                User admin = User.builder()
                        .email("admin@hospital.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
            }

            // 2. Seed Specialities
            if (specialityRepository.count() == 0) {
                Speciality cardiology = Speciality.builder()
                        .name("Cardiology")
                        .description("Disorders of the heart and the circulatory system.")
                        .build();
                Speciality pediatrics = Speciality.builder()
                        .name("Pediatrics")
                        .description("Medical care of infants, children, and adolescents.")
                        .build();
                Speciality dermatology = Speciality.builder()
                        .name("Dermatology")
                        .description("Conditions of the skin, hair, and nails.")
                        .build();
                Speciality neurology = Speciality.builder()
                        .name("Neurology")
                        .description("Disorders of the nervous system.")
                        .build();

                specialityRepository.saveAll(List.of(cardiology, pediatrics, dermatology, neurology));
            }

            // 3. Seed Doctors
            if (doctorRepository.count() == 0) {
                Speciality cardiology = specialityRepository.findByName("Cardiology").orElse(null);
                Speciality pediatrics = specialityRepository.findByName("Pediatrics").orElse(null);
                Speciality neurology = specialityRepository.findByName("Neurology").orElse(null);

                // Doctor 1
                User docUser1 = User.builder()
                        .email("alice@hospital.com")
                        .password(passwordEncoder.encode("doctor123"))
                        .role(Role.DOCTOR)
                        .build();

                Doctor doctor1 = Doctor.builder()
                        .name("Dr. Alice Smith")
                        .email("alice@hospital.com")
                        .phone("555-0101")
                        .speciality(cardiology)
                        .user(docUser1)
                        .build();
                doctorRepository.save(doctor1);

                // Doctor 2
                User docUser2 = User.builder()
                        .email("bob@hospital.com")
                        .password(passwordEncoder.encode("doctor123"))
                        .role(Role.DOCTOR)
                        .build();

                Doctor doctor2 = Doctor.builder()
                        .name("Dr. Bob Johnson")
                        .email("bob@hospital.com")
                        .phone("555-0102")
                        .speciality(pediatrics)
                        .user(docUser2)
                        .build();
                doctorRepository.save(doctor2);

                // Doctor 3
                User docUser3 = User.builder()
                        .email("clara@hospital.com")
                        .password(passwordEncoder.encode("doctor123"))
                        .role(Role.DOCTOR)
                        .build();

                Doctor doctor3 = Doctor.builder()
                        .name("Dr. Clara Oswald")
                        .email("clara@hospital.com")
                        .phone("555-0103")
                        .speciality(neurology)
                        .user(docUser3)
                        .build();
                doctorRepository.save(doctor3);
            }

            // 4. Seed Patients
            if (patientRepository.count() == 0) {
                // Patient 1
                User patUser1 = User.builder()
                        .email("john@gmail.com")
                        .password(passwordEncoder.encode("patient123"))
                        .role(Role.PATIENT)
                        .build();

                Patient patient1 = Patient.builder()
                        .name("John Doe")
                        .email("john@gmail.com")
                        .phone("555-0201")
                        .dateOfBirth(LocalDate.of(1990, 5, 15))
                        .user(patUser1)
                        .build();
                patientRepository.save(patient1);

                // Patient 2
                User patUser2 = User.builder()
                        .email("jane@gmail.com")
                        .password(passwordEncoder.encode("patient123"))
                        .role(Role.PATIENT)
                        .build();

                Patient patient2 = Patient.builder()
                        .name("Jane Miller")
                        .email("jane@gmail.com")
                        .phone("555-0202")
                        .dateOfBirth(LocalDate.of(1995, 8, 22))
                        .user(patUser2)
                        .build();
                patientRepository.save(patient2);
            }

            // 5. Seed Appointments
            if (appointmentRepository.count() == 0) {
                Doctor doctor1 = doctorRepository.findAll().get(0);
                Doctor doctor2 = doctorRepository.findAll().get(1);
                Patient patient1 = patientRepository.findAll().get(0);
                Patient patient2 = patientRepository.findAll().get(1);

                // Seed some appointments across different months for charts
                // June 2026:
                Appointment app1 = Appointment.builder()
                        .doctor(doctor1)
                        .patient(patient1)
                        .appointmentDate(LocalDateTime.of(2026, 6, 17, 10, 0))
                        .reason("Regular cardiac checkup")
                        .status(AppointmentStatus.PENDING)
                        .build();

                Appointment app2 = Appointment.builder()
                        .doctor(doctor2)
                        .patient(patient2)
                        .appointmentDate(LocalDateTime.of(2026, 6, 18, 14, 30))
                        .reason("Pediatric checkup for child")
                        .status(AppointmentStatus.ACCEPTED)
                        .build();

                // May 2026 (completed):
                Appointment app3 = Appointment.builder()
                        .doctor(doctor1)
                        .patient(patient2)
                        .appointmentDate(LocalDateTime.of(2026, 5, 10, 9, 15))
                        .reason("ECG results discussion")
                        .status(AppointmentStatus.COMPLETED)
                        .build();

                // April 2026 (cancelled):
                Appointment app4 = Appointment.builder()
                        .doctor(doctor2)
                        .patient(patient1)
                        .appointmentDate(LocalDateTime.of(2026, 4, 25, 11, 0))
                        .reason("Flu symptoms")
                        .status(AppointmentStatus.CANCELLED)
                        .build();

                appointmentRepository.saveAll(List.of(app1, app2, app3, app4));
            }
        };
    }
}
