package com.service.security.service;

import com.service.security.dto.*;
import com.service.security.model.*;
import com.service.security.repository.AdminRepository;
import com.service.security.exception.ApiException;
import com.service.security.config.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AdminRepository adminRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public void registerAdmin(RegisterRequest req) {
        if (adminRepository.existsByUsername(req.getUsername())) {
            throw new ApiException("Username already taken");
        }
        if (adminRepository.existsByEmail(req.getEmail())) {
            throw new ApiException("Email already registered");
        }
        Admin admin = new Admin();
        admin.setUsername(req.getUsername());
        admin.setEmail(req.getEmail());
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        admin.setRole(Role.ADMIN);
        adminRepository.save(admin);
    }

    public JwtResponse login(LoginRequest req) {
        Optional<Admin> maybe = adminRepository.findByUsername(req.getUsernameOrEmail());
        if (maybe.isEmpty()) {
            maybe = adminRepository.findByEmail(req.getUsernameOrEmail());
            if (maybe.isEmpty()) throw new ApiException("Invalid username/email or password");
        }
        Admin admin = maybe.get();
        if (!passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            throw new ApiException("Invalid username/email or password");
        }
        String token = jwtUtil.generateToken(admin.getUsername(), admin.getRole().name());
        return new JwtResponse(token, admin.getId(), admin.getUsername(), admin.getEmail(), admin.getRole().name());
    }
}
