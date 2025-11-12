package com.example.spm_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Projects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 100, message = "Project name must be between 3 and 100 characters")
    @Column(name = "project_name", nullable = false, unique = true)
    private String name;

    @Size(min = 3, max = 1000, message = "Project description must be between 3 and 1000 characters")
    @Column(name = "project_description")
    private String description;

    @Size(min = 3, max = 100, message = "Project status must be between 3 and 100 characters")
    @Column(name = "project_status")
    private String status;

    @Size(min = 3, max = 100, message = "Project nea date must be between 3 and 100 characters")
    @Column(name = "project_nea_date")
    private String neaDate;

    @Size(min = 3, max = 100, message = "Project pfho date must be between 3 and 100 characters")
    @Column(name = "project_pfho_date")
    private String pfhoDate;
}
