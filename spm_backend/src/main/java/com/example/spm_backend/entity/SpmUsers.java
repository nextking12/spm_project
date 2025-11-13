package com.example.spm_backend.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
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
@Table(name = "spm_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpmUsers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    @Column(name = "username", nullable = false, unique = true)
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Username contains invalid characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 3, max = 100, message = "Password must be between 3 and 100 characters")
    @Column(name = "password", nullable = false)
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Password contains invalid characters")
    private String password;
    
    @NotBlank(message = "Email is required")
    @Size(min = 3, max = 100, message = "Email must be between 3 and 100 characters")
    @Column(name = "email", nullable = false, unique = true)
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Email contains invalid characters")
    private String email;

    @NotBlank(message = "Role is required")
    @Size(min = 3, max = 100, message = "Role must be between 3 and 100 characters")
    @Column(name = "role", nullable = false)
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.\\s]+$", message = "Role contains invalid characters")
    private String role;

   
    
}
