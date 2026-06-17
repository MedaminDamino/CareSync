package com.hospital.appointment.strategy.impl;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.AppointmentStatus;
import com.hospital.appointment.enums.Role;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.strategy.AppointmentStatusStrategy;
import org.springframework.stereotype.Component;

@Component
public class CancelStrategy implements AppointmentStatusStrategy {

    @Override
    public AppointmentStatus getTargetStatus() {
        return AppointmentStatus.CANCELLED;
    }

    @Override
    public void execute(Appointment appointment, User currentUser) {
        AppointmentStatus status = appointment.getStatus();
        // Validation: must be in PENDING or ACCEPTED state to cancel
        if (status != AppointmentStatus.PENDING && status != AppointmentStatus.ACCEPTED) {
            throw new BadRequestException("Only PENDING or ACCEPTED appointments can be cancelled.");
        }

        // Authorization: Admin can do anything, Patient must own it, Doctor must own it
        if (currentUser.getRole() == Role.PATIENT) {
            if (appointment.getPatient() == null || 
                appointment.getPatient().getUser() == null ||
                !appointment.getPatient().getUser().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Patients can only cancel their own appointments.");
            }
        } else if (currentUser.getRole() == Role.DOCTOR) {
            if (appointment.getDoctor() == null || 
                appointment.getDoctor().getUser() == null ||
                !appointment.getDoctor().getUser().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Doctors can only cancel their own appointments.");
            }
        } else if (currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("You are not authorized to cancel this appointment.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
    }
}
