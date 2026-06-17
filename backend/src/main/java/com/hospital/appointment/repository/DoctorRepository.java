package com.hospital.appointment.repository;

import com.hospital.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserEmail(String email);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findBySpecialityId(Long specialityId);
}
