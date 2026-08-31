package com.example.angulardashboard.user.service;

import com.example.angulardashboard.common.ResourceNotFoundException;
import com.example.angulardashboard.user.dto.UserDto;
import com.example.angulardashboard.user.dto.UserUpsertRequest;
import com.example.angulardashboard.user.entity.Role;
import com.example.angulardashboard.user.entity.User;
import com.example.angulardashboard.user.repository.RoleRepository;
import com.example.angulardashboard.user.repository.UserRepository;
import java.util.HashSet;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The Angular "Kullanıcılar" screen (features/users/) has no password field, so
 * users created here get this fixed development-only password. A real product
 * would add an invite/reset-password flow instead — documented in the README.
 */
@Service
public class UserService {

    private static final String DEFAULT_NEW_USER_PASSWORD = "changeme123";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(UserMapper::toDto).toList();
    }

    public UserDto findById(Long id) {
        return UserMapper.toDto(getUserOrThrow(id));
    }

    @Transactional
    public UserDto create(UserUpsertRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Bu kullanıcı adı zaten kullanılıyor.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Bu e-posta zaten kullanılıyor.");
        }

        User user = new User(
            request.getUsername(),
            passwordEncoder.encode(DEFAULT_NEW_USER_PASSWORD),
            request.getName(),
            request.getEmail());
        user.setRoles(new HashSet<>(List.of(resolveRole(request.getRole()))));

        return UserMapper.toDto(userRepository.save(user));
    }

    @Transactional
    public UserDto update(Long id, UserUpsertRequest request) {
        User user = getUserOrThrow(id);

        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Bu kullanıcı adı zaten kullanılıyor.");
        }
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Bu e-posta zaten kullanılıyor.");
        }

        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRoles(new HashSet<>(List.of(resolveRole(request.getRole()))));

        return UserMapper.toDto(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = getUserOrThrow(id);
        userRepository.delete(user);
    }

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + id));
    }

    private Role resolveRole(String roleName) {
        return roleRepository.findByName(roleName)
            .orElseThrow(() -> new IllegalArgumentException("Geçersiz rol: " + roleName));
    }
}
