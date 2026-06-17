package com.hospital.appointment.controller;

import com.hospital.appointment.dto.SpecialityDTO;
import com.hospital.appointment.service.SpecialityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/specialities")
public class SpecialityController {

    @Autowired
    private SpecialityService specialityService;

    @GetMapping
    public ResponseEntity<List<SpecialityDTO>> getAllSpecialities() {
        return ResponseEntity.ok(specialityService.getAllSpecialities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecialityDTO> getSpecialityById(@PathVariable Long id) {
        return ResponseEntity.ok(specialityService.getSpecialityById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecialityDTO> createSpeciality(@Valid @RequestBody SpecialityDTO specialityDTO) {
        return ResponseEntity.ok(specialityService.createSpeciality(specialityDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecialityDTO> updateSpeciality(@PathVariable Long id, @Valid @RequestBody SpecialityDTO specialityDTO) {
        return ResponseEntity.ok(specialityService.updateSpeciality(id, specialityDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSpeciality(@PathVariable Long id) {
        specialityService.deleteSpeciality(id);
        return ResponseEntity.noContent().build();
    }
}
