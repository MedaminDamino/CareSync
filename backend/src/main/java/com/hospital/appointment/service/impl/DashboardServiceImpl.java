package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.DashboardStatsDTO;
import com.hospital.appointment.dto.MonthlyCountDTO;
import com.hospital.appointment.dto.SpecialityCountDTO;
import com.hospital.appointment.enums.AppointmentStatus;
import com.hospital.appointment.repository.AppointmentRepository;
import com.hospital.appointment.repository.DoctorRepository;
import com.hospital.appointment.repository.PatientRepository;
import com.hospital.appointment.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public DashboardStatsDTO getDashboardStats() {
        long totalDoctors = doctorRepository.count();
        long totalPatients = patientRepository.count();
        long totalAppointments = appointmentRepository.count();

        // 1. Appointments by Status
        List<Object[]> statusCounts = appointmentRepository.countAppointmentsByStatus();
        Map<String, Long> appointmentsByStatus = new HashMap<>();
        for (Object[] row : statusCounts) {
            if (row[0] != null) {
                appointmentsByStatus.put(((AppointmentStatus) row[0]).name(), (Long) row[1]);
            }
        }
        // Ensure all statuses have a value
        for (AppointmentStatus status : AppointmentStatus.values()) {
            appointmentsByStatus.putIfAbsent(status.name(), 0L);
        }

        // 2. Appointments per month
        List<Object[]> monthCounts = appointmentRepository.countAppointmentsPerMonth();
        List<MonthlyCountDTO> appointmentsPerMonth = new ArrayList<>();
        for (Object[] row : monthCounts) {
            Integer year = (Integer) row[0];
            Integer month = (Integer) row[1];
            Long count = (Long) row[2];
            String monthStr = String.format("%d-%02d", year, month);
            appointmentsPerMonth.add(new MonthlyCountDTO(monthStr, count));
        }

        // 3. Most requested speciality
        List<Object[]> specialityCounts = appointmentRepository.findMostRequestedSpecialities();
        List<SpecialityCountDTO> mostRequestedSpecialities = new ArrayList<>();
        for (Object[] row : specialityCounts) {
            String specName = (String) row[0];
            Long count = (Long) row[1];
            mostRequestedSpecialities.add(new SpecialityCountDTO(specName, count));
        }

        return DashboardStatsDTO.builder()
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .totalAppointments(totalAppointments)
                .appointmentsByStatus(appointmentsByStatus)
                .appointmentsPerMonth(appointmentsPerMonth)
                .mostRequestedSpecialities(mostRequestedSpecialities)
                .build();
    }
}
