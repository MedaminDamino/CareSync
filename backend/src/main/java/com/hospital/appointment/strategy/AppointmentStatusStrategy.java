package com.hospital.appointment.strategy;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.AppointmentStatus;

public interface AppointmentStatusStrategy {
    AppointmentStatus getTargetStatus();
    void execute(Appointment appointment, User currentUser);
}
