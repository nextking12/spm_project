package com.example.spm_backend.entity;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Projects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false,unique = true)
    @NotBlank(message = "Project name is required")
    @Size(min = 1, max = 255, message ="Project name must be between 1 and 255 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Script name contains invalid characters")
    private String name;



}
