package com.example.angulardashboard.user.service;

import com.example.angulardashboard.user.dto.UserDto;
import com.example.angulardashboard.user.entity.Role;
import com.example.angulardashboard.user.entity.User;
import java.util.List;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserDto toDto(User user) {
        List<String> roles = user.getRoles().stream().map(Role::getName).sorted().toList();
        return new UserDto(user.getId(), user.getUsername(), user.getName(), user.getEmail(), roles);
    }
}
