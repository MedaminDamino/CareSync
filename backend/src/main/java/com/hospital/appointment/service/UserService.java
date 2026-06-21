package com.hospital.appointment.service;

import com.hospital.appointment.dto.BlockUserRequest;
import com.hospital.appointment.dto.UserDTO;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO getUserByEmail(String email);
    UserDTO blockUser(Long id, BlockUserRequest request, String adminEmail);
    UserDTO unblockUser(Long id);
}

