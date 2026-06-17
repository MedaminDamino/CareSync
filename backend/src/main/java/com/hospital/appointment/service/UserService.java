package com.hospital.appointment.service;

import com.hospital.appointment.dto.UserDTO;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO getUserByEmail(String email);
}
