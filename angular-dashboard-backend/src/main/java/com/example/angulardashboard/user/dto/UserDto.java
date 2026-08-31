package com.example.angulardashboard.user.dto;

import java.util.List;

/**
 * Response shape — mirrors the Angular {@code User} interface
 * (src/app/core/auth/auth.models.ts) exactly: id, username, name, email, roles.
 */
public class UserDto {

    private final Long id;
    private final String username;
    private final String name;
    private final String email;
    private final List<String> roles;

    public UserDto(Long id, String username, String name, String email, List<String> roles) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getRoles() {
        return roles;
    }
}
