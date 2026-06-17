package com.hospital.appointment.repository;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByStatus(AppointmentStatus status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    long countByStatus(AppointmentStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Appointment a GROUP BY a.status")
    List<Object[]> countAppointmentsByStatus();

    @Query("SELECT YEAR(a.appointmentDate), MONTH(a.appointmentDate), COUNT(a) FROM Appointment a GROUP BY YEAR(a.appointmentDate), MONTH(a.appointmentDate) ORDER BY YEAR(a.appointmentDate), MONTH(a.appointmentDate)")
    List<Object[]> countAppointmentsPerMonth();

    @Query("SELECT a.doctor.speciality.name, COUNT(a) FROM Appointment a GROUP BY a.doctor.speciality.name ORDER BY COUNT(a) DESC")
    List<Object[]> findMostRequestedSpecialities();
}
