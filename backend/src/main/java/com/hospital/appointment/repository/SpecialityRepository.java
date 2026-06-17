package com.hospital.appointment.repository;

import com.hospital.appointment.entity.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpecialityRepository extends JpaRepository<Speciality, Long> {
    Optional<Speciality> findByName(String name);
    boolean existsByName(String name);
}
