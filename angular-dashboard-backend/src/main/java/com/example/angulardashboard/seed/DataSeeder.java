package com.example.angulardashboard.seed;

import com.example.angulardashboard.user.entity.Role;
import com.example.angulardashboard.user.entity.User;
import com.example.angulardashboard.user.repository.RoleRepository;
import com.example.angulardashboard.user.repository.UserRepository;
import java.util.HashSet;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Ensures the ADMIN/EDITOR/USER roles and the demo admin account exist.
 * Idempotent: checked by name/username on every startup, never duplicated.
 *
 * Demo credentials (development only — see README): admin / admin123
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final String[] ROLE_NAMES = { "ADMIN", "EDITOR", "USER" };

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Role adminRole = null;
        for (String roleName : ROLE_NAMES) {
            Role role = ensureRole(roleName);
            if ("ADMIN".equals(roleName)) {
                adminRole = role;
            }
        }

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", passwordEncoder.encode("admin123"), "Admin User", "admin@example.com");
            admin.setRoles(new HashSet<>(Set.of(adminRole)));
            userRepository.save(admin);
        }
    }

    private Role ensureRole(String name) {
        return roleRepository.findByName(name).orElseGet(() -> roleRepository.save(new Role(name)));
    }
}
