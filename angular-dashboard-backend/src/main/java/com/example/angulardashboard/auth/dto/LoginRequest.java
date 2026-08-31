package com.example.angulardashboard.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Mirrors the fields Angular's {@code LoginCredentials} actually needs on the backend. */
public class LoginRequest {

    @NotBlank(message = "Kullanıcı adı zorunludur.")
    private String username;

    @NotBlank(message = "Şifre zorunludur.")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
