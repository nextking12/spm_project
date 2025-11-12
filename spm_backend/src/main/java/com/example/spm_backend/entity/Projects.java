package com.example.spm_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project name contains invalid characters")
    private String name;

    @Size(min = 3, max = 1000, message = "Project description must be between 3 and 1000 characters")
    @Column(name = "project_description")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project description contains invalid characters")
    private String description;

    @Size(min = 3, max = 100, message = "Project status must be between 3 and 100 characters")
    @Column(name = "project_status")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project status contains invalid characters")
    private String status;

    @Size(min = 3, max = 100, message = "Project nea date must be between 3 and 100 characters")
    @Column(name = "project_nea_date")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project nea date contains invalid characters")
    private String neaDate;

    @Size(min = 3, max = 100, message = "Project pfho date must be between 3 and 100 characters")
    @Column(name = "project_pfho_date")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project pfho date contains invalid characters")
    private String pfhoDate;

    @Size(min = 3, max = 100, message = "Project budget must be between 3 and 100 characters")
    @Column(name = "project_budget")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project budget contains invalid characters")
    private String budget;

    @Size(min = 3, max = 100, message = "Project spent budget must be between 3 and 100 characters")
    @Column(name = "project_spent_budget")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project spent budget contains invalid characters")
    private String spentBudget;

    @Size(min = 3, max = 100, message = "Project car expiration date must be between 3 and 100 characters")
    @Column(name = "project_car_expiration_date")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project car expiration date contains invalid characters")
    private String carExpirationDate;

    @Size(min = 3, max = 1000, message = "Project notes must be between 3 and 1000 characters")
    @Column(name = "project_notes")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Project notes contains invalid characters")
    private String notes;

    
}
