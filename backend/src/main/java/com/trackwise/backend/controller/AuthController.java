package com.trackwise.backend.controller;

import com.trackwise.backend.dto.AuthResponse;
import com.trackwise.backend.dto.LoginRequest;
import com.trackwise.backend.dto.RegisterRequest;
import com.trackwise.backend.entity.User;
import com.trackwise.backend.repository.UserRepository;
import com.trackwise.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setLastLogin(new java.sql.Timestamp(System.currentTimeMillis()));
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getId());
        return ResponseEntity.ok(new AuthResponse(token, new AuthResponse.UserDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getCreatedAt(), savedUser.getLastLogin())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        user.setLastLogin(new java.sql.Timestamp(System.currentTimeMillis()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.ok(new AuthResponse(token, new AuthResponse.UserDto(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt(), user.getLastLogin())));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Long userId = Long.parseLong(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            return ResponseEntity.ok(new AuthResponse.UserDto(u.getId(), u.getName(), u.getEmail(), u.getCreatedAt(), u.getLastLogin()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
}
