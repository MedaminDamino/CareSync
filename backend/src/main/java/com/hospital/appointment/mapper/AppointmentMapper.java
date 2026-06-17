package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.AppointmentDTO;
import com.hospital.appointment.entity.Appointment;

public class AppointmentMapper {
    public static AppointmentDTO toDTO(Appointment appointment) {
        if (appointment == null) return null;
        return AppointmentDTO.builder()
                .id(appointment.getId())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getName())
                .specialityName(appointment.getDoctor().getSpeciality().getName())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getName())
                .appointmentDate(appointment.getAppointmentDate())
                .reason(appointment.getReason())
                .status(appointment.getStatus())
                .build();
    }
}
