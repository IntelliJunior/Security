package com.service.security.controller;

import com.service.security.dto.*;
import com.service.security.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "THe API to Register, Login and Ping Admin")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a Admin")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest req) {
        authService.registerAdmin(req);
        return ResponseEntity.ok("Admin registered successfully");
    }

    @PostMapping("/login")
    @Operation(summary = "Login a Admin")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest req) {
        JwtResponse resp = authService.login(req);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/ping")
    @Operation(summary = "Ping a Admin")
    public ResponseEntity<String> ping(){
        return ResponseEntity.ok("pong");
    }
}
