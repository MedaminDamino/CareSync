package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.SpecialityDTO;
import com.hospital.appointment.entity.Speciality;
import com.hospital.appointment.exception.BadRequestException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.mapper.SpecialityMapper;
import com.hospital.appointment.repository.SpecialityRepository;
import com.hospital.appointment.service.SpecialityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecialityServiceImpl implements SpecialityService {

    @Autowired
    private SpecialityRepository specialityRepository;

    @Override
    public List<SpecialityDTO> getAllSpecialities() {
        return specialityRepository.findAll().stream()
                .map(SpecialityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SpecialityDTO getSpecialityById(Long id) {
        Speciality speciality = specialityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found with id: " + id));
        return SpecialityMapper.toDTO(speciality);
    }

    @Override
    @Transactional
    public SpecialityDTO createSpeciality(SpecialityDTO specialityDTO) {
        if (specialityRepository.existsByName(specialityDTO.getName())) {
            throw new BadRequestException("Speciality with name '" + specialityDTO.getName() + "' already exists.");
        }
        Speciality speciality = SpecialityMapper.toEntity(specialityDTO);
        Speciality saved = specialityRepository.save(speciality);
        return SpecialityMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public SpecialityDTO updateSpeciality(Long id, SpecialityDTO specialityDTO) {
        Speciality speciality = specialityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found with id: " + id));

        if (!speciality.getName().equalsIgnoreCase(specialityDTO.getName()) && specialityRepository.existsByName(specialityDTO.getName())) {
            throw new BadRequestException("Speciality with name '" + specialityDTO.getName() + "' already exists.");
        }

        speciality.setName(specialityDTO.getName());
        speciality.setDescription(specialityDTO.getDescription());

        Speciality updated = specialityRepository.save(speciality);
        return SpecialityMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteSpeciality(Long id) {
        Speciality speciality = specialityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found with id: " + id));
        specialityRepository.delete(speciality);
    }
}
