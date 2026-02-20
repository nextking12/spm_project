package com.example.spm_project_back_java.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.spm_project_back_java.entity.Project;
import com.example.spm_project_back_java.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existing = getProjectById(id);
        if (existing == null) {
            return null;
        }
        existing.setName(updatedProject.getName());
        existing.setDescription(updatedProject.getDescription());
        existing.setStatus(updatedProject.getStatus());
        existing.setStartDate(updatedProject.getStartDate());
        existing.setNeaDate(updatedProject.getNeaDate());
        existing.setPfhoDate(updatedProject.getPfhoDate());
        return projectRepository.save(existing);
    }

    public boolean deleteProject(Long id) {
        Project existing = getProjectById(id);
        if (existing == null) {
            return false;
        }
        projectRepository.deleteById(id);
        return true;
    }
}
