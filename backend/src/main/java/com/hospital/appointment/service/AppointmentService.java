package com.hospital.appointment.service;

import com.hospital.appointment.dto.AppointmentDTO;
import com.hospital.appointment.enums.AppointmentStatus;
import java.util.List;

public interface AppointmentService {
    List<AppointmentDTO> getAllAppointments();
    List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId);
    List<AppointmentDTO> getAppointmentsByPatient(Long patientId);
    AppointmentDTO getAppointmentById(Long id);
    AppointmentDTO bookAppointment(AppointmentDTO appointmentDTO);
    AppointmentDTO updateAppointmentStatus(Long id, AppointmentStatus status);
    void deleteAppointment(Long id);
}
