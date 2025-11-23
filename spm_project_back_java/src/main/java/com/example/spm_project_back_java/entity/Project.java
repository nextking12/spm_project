package com.example.spm_project_back_java.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    @NotBlank(message = "Name cannot be empty")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]+$", message = "Name can only contain letters, numbers, and spaces")
    private String name;
    
    @Column(name = "description")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]+$", message = "Description can only contain letters, numbers, and spaces")
    private String description;
    
    @Column(name = "status")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]+$", message = "Status can only contain letters, numbers, and spaces")
    private String status;
    
    @Column(name = "start_date")
    @Pattern(regexp = "^[a-zA-Z0-9_ ]+$", message = "Start date can only contain letters, numbers, and spaces")
    private String startDate;
    
   @Column(name = "nea_date")
   @Pattern(regexp = "^[a-zA-Z0-9_ ]+$", message = "NEA date can only contain letters, numbers, and spaces")
   private String neaDate;

   @Column(name = "pfho_date")
   @Pattern(regexp = "^[a-zA-Z0-9_ ]+$", message = "PFHO date can only contain letters, numbers, and spaces")
   private String pfhoDate;

}
