package com.hospital.appointment.strategy.impl;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.AppointmentStatus;
import com.hospital.appointment.enums.Role;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.strategy.AppointmentStatusStrategy;
import org.springframework.stereotype.Component;

@Component
public class AcceptStrategy implements AppointmentStatusStrategy {

    @Override
    public AppointmentStatus getTargetStatus() {
        return AppointmentStatus.ACCEPTED;
    }

    @Override
    public void execute(Appointment appointment, User currentUser) {
        // Validation: must be in PENDING state to accept
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Only PENDING appointments can be accepted.");
        }

        // Authorization: Admin can do anything, Doctor must own it
        if (currentUser.getRole() == Role.DOCTOR) {
            if (appointment.getDoctor() == null || 
                appointment.getDoctor().getUser() == null ||
                !appointment.getDoctor().getUser().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Doctors can only accept their own appointments.");
            }
        } else if (currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only doctors and admins can accept appointments.");
        }

        appointment.setStatus(AppointmentStatus.ACCEPTED);
    }
}
