package com.example.spm_project_back_java.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spm_project_back_java.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAll();

    Optional <Project> findById(Long id);

    Project findByName(String name);

    Project findByDescription(String description);

    Project findByStatus(String status);

    Project findByStartDate(String startDate);

    Project findByNeaDate(String neaDate);

    Project findByPfhoDate(String pfhoDate);

}
