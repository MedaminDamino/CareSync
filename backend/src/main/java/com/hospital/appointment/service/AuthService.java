package com.hospital.appointment.service;

import com.hospital.appointment.dto.AuthResponse;
import com.hospital.appointment.dto.LoginRequest;
import com.hospital.appointment.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
}
