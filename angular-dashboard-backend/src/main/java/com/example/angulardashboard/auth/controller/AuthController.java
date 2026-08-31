package com.example.angulardashboard.auth.controller;

import com.example.angulardashboard.auth.dto.AuthResponseDto;
import com.example.angulardashboard.auth.dto.LoginRequest;
import com.example.angulardashboard.security.JwtService;
import com.example.angulardashboard.user.entity.User;
import com.example.angulardashboard.user.repository.UserRepository;
import com.example.angulardashboard.user.service.UserMapper;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public AuthResponseDto login(@Valid @RequestBody LoginRequest request) {
        // Throws AuthenticationException (bad password, disabled account, unknown user) —
        // handled centrally by GlobalExceptionHandler as a 401.
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new IllegalStateException("Authenticated user vanished: " + request.getUsername()));

        String token = jwtService.generateToken(user);
        return new AuthResponseDto(token, UserMapper.toDto(user));
    }
}
