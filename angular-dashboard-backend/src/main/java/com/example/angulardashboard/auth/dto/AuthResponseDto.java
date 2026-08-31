package com.example.angulardashboard.auth.dto;

import com.example.angulardashboard.user.dto.UserDto;

/** Mirrors the Angular {@code AuthResponse} interface (src/app/core/auth/auth.models.ts). */
public class AuthResponseDto {

    private final String token;
    private final UserDto user;

    public AuthResponseDto(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public UserDto getUser() {
        return user;
    }
}
