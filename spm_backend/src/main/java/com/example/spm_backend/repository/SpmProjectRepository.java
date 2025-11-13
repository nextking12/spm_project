package com.example.spm_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spm_backend.entity.Projects;

public interface SpmProjectRepository extends JpaRepository<Projects, Long> {

}
