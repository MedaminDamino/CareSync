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

        // Authorization: Admin can do anything, Patient must own it, Doctor must own it
        if (currentUser.getRole() == Role.PATIENT) {
            if (appointment.getPatient() == null ||
                appointment.getPatient().getUser() == null ||
                !appointment.getPatient().getUser().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Patients can only cancel their own appointments.");
            }
            // Patients can only cancel PENDING appointments
            if (status != AppointmentStatus.PENDING) {
                throw new BadRequestException("You can only cancel appointments that are still pending. Once a doctor has accepted your appointment it can no longer be cancelled.");
            }
        } else if (currentUser.getRole() == Role.DOCTOR) {
            if (appointment.getDoctor() == null ||
                appointment.getDoctor().getUser() == null ||
                !appointment.getDoctor().getUser().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Doctors can only cancel their own appointments.");
            }
            // Doctors can cancel PENDING or ACCEPTED
            if (status != AppointmentStatus.PENDING && status != AppointmentStatus.ACCEPTED) {
                throw new BadRequestException("Only PENDING or ACCEPTED appointments can be cancelled.");
            }
        } else if (currentUser.getRole() == Role.ADMIN) {
            // Admins can cancel PENDING or ACCEPTED
            if (status != AppointmentStatus.PENDING && status != AppointmentStatus.ACCEPTED) {
                throw new BadRequestException("Only PENDING or ACCEPTED appointments can be cancelled.");
            }
        } else {
            throw new BadRequestException("You are not authorized to cancel this appointment.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
    }
}
