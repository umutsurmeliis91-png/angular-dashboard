package com.example.angulardashboard.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Create/update request body — mirrors the Angular {@code UserFormValue}
 * (src/app/shared/models/user.models.ts): username, name, email, a single role.
 */
public class UserUpsertRequest {

    @NotBlank(message = "Kullanıcı adı zorunludur.")
    private String username;

    @NotBlank(message = "Ad soyad zorunludur.")
    private String name;

    @NotBlank(message = "E-posta zorunludur.")
    @Email(message = "Geçerli bir e-posta adresi girin.")
    private String email;

    @NotBlank(message = "Rol zorunludur.")
    private String role;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
