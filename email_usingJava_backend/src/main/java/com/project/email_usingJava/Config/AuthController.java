package com.project.email_usingJava.Config;

//AuthController.java

import com.project.email_usingJava.User.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.project.email_usingJava.Config.JwtUtil;
import com.project.email_usingJava.Email.UserSubscriberRepository;

import java.util.function.Supplier;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

 @Autowired
 private UserRepository userRepository;
 
 @Autowired
 private PasswordEncoder passwordEncoder;

 @Autowired
 private JwtUtil jwtUtil;

 @Autowired
 private UserSubscriberRepository userSubscriberRepository;

 @PostMapping("/signup")
 public ResponseEntity<String> signup(@RequestBody UserModel user) {
     try {
         if (userRepository.findByUsername(user.getUsername()).isPresent()) {
             return ResponseEntity.badRequest().body("Username already exists");
         }
         if (userRepository.findByEmail(user.getEmail()).isPresent()) {
             return ResponseEntity.badRequest().body("Email already registered");
         }
         // Hash the password before saving
         user.setPassword(passwordEncoder.encode(user.getPassword()));
         // Set a default app password if not provided
         if (user.getAppPassword() == null || user.getAppPassword().isEmpty()) {
             user.setAppPassword("default-app-password");
         }
         userRepository.save(user);
         
         // Create user's subscriber table
         userSubscriberRepository.createUserTable(user.getUsername());
         
         return ResponseEntity.ok("Signup successful");
     } catch (Exception e) {
         System.err.println("Signup error: " + e.getMessage());
         e.printStackTrace();
         return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
     }
 }

 @PostMapping("/login")
 public ResponseEntity<?> login(@RequestBody UserModel credentials) {
     try {
         System.out.println("Login attempt for username: " + credentials.getUsername());
         
         if (credentials.getUsername() == null || credentials.getPassword() == null) {
             return ResponseEntity.badRequest().body("Username and password are required");
         }
         
         Optional<UserModel> userOpt = userRepository.findByUsername(credentials.getUsername());
         if (userOpt.isEmpty()) {
             userOpt = userRepository.findByEmail(credentials.getUsername());
         }
         
         if (userOpt.isPresent()) {
             UserModel user = userOpt.get();
             System.out.println("User found: " + user.getUsername() + ", email: " + user.getEmail());
             
             if (passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
                 System.out.println("Password matches, login successful");
                 try {
                     // Generate JWT token
                     String token = jwtUtil.generateToken(user.getUsername());
                     System.out.println("JWT token generated successfully");
                     Map<String, String> response = Map.of(
                         "token", token,
                         "username", user.getUsername(),
                         "email", user.getEmail()
                     );
                     return ResponseEntity.ok(response);
                 } catch (Exception jwtError) {
                     System.err.println("JWT generation error: " + jwtError.getMessage());
                     jwtError.printStackTrace();
                     return ResponseEntity.status(500).body("Token generation failed: " + jwtError.getMessage());
                 }
             } else {
                 System.out.println("Password does not match");
             }
         } else {
             System.out.println("User not found: " + credentials.getUsername());
         }
         
         return ResponseEntity.badRequest().body("Invalid credentials");
     } catch (Exception e) {
         System.err.println("Login error: " + e.getMessage());
         e.printStackTrace();
         return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
     }
 }

 @PostMapping("/update-app-password")
 public ResponseEntity<String> updateAppPassword(@RequestBody Map<String, String> payload) {
     String username = payload.get("username");
     String newAppPassword = payload.get("appPassword");
     Optional<UserModel> userOpt = userRepository.findByUsername(username);
     if (userOpt.isPresent()) {
         UserModel user = userOpt.get();
         user.setAppPassword(newAppPassword);
         userRepository.save(user);
         return ResponseEntity.ok("App password updated successfully");
     } else {
         return ResponseEntity.badRequest().body("User not found");
     }
 }

 @GetMapping("/app-password")
 public ResponseEntity<?> getAppPassword(@RequestParam String username) {
     Optional<UserModel> userOpt = userRepository.findByUsername(username);
     if (userOpt.isPresent()) {
         UserModel user = userOpt.get();
         Map<String, String> response = Map.of(
             "appPassword", user.getAppPassword()
         );
         return ResponseEntity.ok(response);
     } else {
         return ResponseEntity.badRequest().body("User not found");
     }
 }

 @GetMapping("/test-auth")
 public ResponseEntity<?> testAuth(Authentication authentication) {
     try {
         System.out.println("Test auth endpoint called");
         System.out.println("Authentication: " + authentication);
         System.out.println("Authentication name: " + (authentication != null ? authentication.getName() : "null"));
         System.out.println("Authentication authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));
         
         if (authentication != null && authentication.isAuthenticated()) {
             return ResponseEntity.ok(Map.of(
                 "message", "Authentication successful",
                 "username", authentication.getName(),
                 "authorities", authentication.getAuthorities().toString()
             ));
         } else {
             return ResponseEntity.status(401).body(Map.of(
                 "message", "Authentication failed",
                 "authentication", authentication != null ? "present" : "null"
             ));
         }
     } catch (Exception e) {
         System.err.println("Error in test auth: " + e.getMessage());
         e.printStackTrace();
         return ResponseEntity.status(500).body(Map.of(
             "message", "Error testing authentication",
             "error", e.getMessage()
         ));
     }
 }

 @GetMapping("/ping")
 public ResponseEntity<String> ping() {
     return ResponseEntity.ok("Backend is running!");
 }

 @PostMapping("/logout")
 public ResponseEntity<String> logout() {
     // In a stateless JWT system, logout is handled on the client side
     // by removing the token from localStorage
     return ResponseEntity.ok("Logout successful. Please clear your browser's localStorage.");
 }
}

