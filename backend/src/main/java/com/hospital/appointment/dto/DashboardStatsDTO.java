package com.hospital.appointment.dto;

import lombok.*;
import java.util.Map;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private Map<String, Long> appointmentsByStatus;
    private List<MonthlyCountDTO> appointmentsPerMonth;
    private List<SpecialityCountDTO> mostRequestedSpecialities;
}
