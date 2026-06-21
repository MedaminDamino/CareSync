package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.BlockUserRequest;
import com.hospital.appointment.dto.UserDTO;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.enums.UserStatus;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.mapper.UserMapper;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO blockUser(Long id, BlockUserRequest request, String adminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new BadRequestException("User is already blocked.");
        }

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found."));

        String blockNote = request.getReason();
        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            blockNote = request.getReason() + " — " + request.getNotes();
        }

        user.setStatus(UserStatus.BLOCKED);
        user.setBlockReason(blockNote);
        user.setBlockedAt(LocalDateTime.now());
        user.setBlockedBy(admin.getId());

        return UserMapper.toDTO(userRepository.save(user));
    }

    @Override
    public UserDTO unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new BadRequestException("User is not currently blocked.");
        }

        user.setStatus(UserStatus.ACTIVE);
        user.setBlockReason(null);
        user.setBlockedAt(null);
        user.setBlockedBy(null);

        return UserMapper.toDTO(userRepository.save(user));
    }
}

