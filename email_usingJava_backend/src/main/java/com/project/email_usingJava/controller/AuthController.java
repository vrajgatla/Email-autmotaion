package com.project.email_usingJava.controller;

//AuthController.java

import com.project.email_usingJava.model.UserModel;
import com.project.email_usingJava.repository.UserRepository;
import com.project.email_usingJava.Config.JwtUtil;
import com.project.email_usingJava.repository.UserSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.util.Optional;
import com.project.email_usingJava.exception.*;

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
     if (userRepository.findByUsername(user.getUsername()).isPresent()) {
         throw new UserAlreadyExistsException("Username already exists");
     }
     if (userRepository.findByEmail(user.getEmail()).isPresent()) {
         throw new UserAlreadyExistsException("Email already registered");
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
 }

 @PostMapping("/login")
 public ResponseEntity<?> login(@RequestBody UserModel credentials) {
     if (credentials.getUsername() == null || credentials.getPassword() == null) {
         throw new InvalidInputException("Username and password are required");
     }
     Optional<UserModel> userOpt = userRepository.findByUsername(credentials.getUsername());
     if (userOpt.isEmpty()) {
         userOpt = userRepository.findByEmail(credentials.getUsername());
     }
     if (userOpt.isPresent()) {
         UserModel user = userOpt.get();
         if (passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
             try {
                 String token = jwtUtil.generateToken(user.getUsername());
                 Map<String, String> response = Map.of(
                     "token", token,
                     "username", user.getUsername(),
                     "email", user.getEmail()
                 );
                 return ResponseEntity.ok(response);
             } catch (Exception jwtError) {
                 throw new JwtTokenException("Token generation failed: " + jwtError.getMessage());
             }
         } else {
             throw new AuthenticationException("Invalid username or password.");
         }
     } else {
         throw new AuthenticationException("Invalid username or password.");
     }
 }

 @PostMapping("/update-app-password")
 public ResponseEntity<String> updateAppPassword(@RequestBody Map<String, String> payload) {
     String username = payload.get("username");
     String newAppPassword = payload.get("appPassword");
     Optional<UserModel> userOpt = userRepository.findByUsername(username);
     if (userOpt.isPresent()) {
         UserModel user = userOpt.get();
         user.setAppPassword(newAppPassword); // Encrypt and hash the new password
         userRepository.save(user);
         return ResponseEntity.ok("App password updated successfully");
     } else {
         throw new UserNotFoundException("User not found");
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
         throw new UserNotFoundException("User not found");
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

 // --- PROFILE ENDPOINTS ---
 @GetMapping("/profile")
 public ResponseEntity<?> getProfile(Authentication authentication) {
     if (authentication == null || authentication.getName() == null) {
         return ResponseEntity.status(401).body("Not authenticated");
     }
     String username = authentication.getName();
     Optional<UserModel> userOpt = userRepository.findByUsername(username);
     if (userOpt.isEmpty()) {
         return ResponseEntity.status(404).body("User not found");
     }
     UserModel user = userOpt.get();

     // Count active subscribers
     int subscriberCount = userSubscriberRepository.countSubscribers(username);
     // Total emails sent
     int sentEmails = user.getSentEmails();

     String avatarBase64 = null;
     if (user.getAvatar() != null && user.getAvatar().length > 0) {
         avatarBase64 = "data:image/png;base64," + java.util.Base64.getEncoder().encodeToString(user.getAvatar());
     } else {
         avatarBase64 = "https://randomuser.me/api/portraits/men/32.jpg"; // Default avatar
     }
     Map<String, Object> profile = Map.of(
         "name", user.getFullName() != null ? user.getFullName() : user.getUsername(),
         "username", user.getUsername(),
         "email", user.getEmail(),
         "verified", true,
         "avatar", avatarBase64,
         "stats", Map.of(
             "emailsSent", sentEmails,
             "subscribers", subscriberCount,
             "daily", new int[]{10, 20, 15, 30, 25, 40, 35},
             "weekly", new int[]{100, 120, 110, 130, 125, 140, 135}
         ),
         "personal", Map.of(
             "fullName", user.getFullName() != null ? user.getFullName() : user.getUsername(),
             "dob", user.getDob() != null ? user.getDob() : "Not provided",
             "gender", user.getGender() != null ? user.getGender() : "Not specified",
             "phone", user.getPhone() != null ? user.getPhone() : "Not provided",
             "address", user.getAddress() != null ? user.getAddress() : "Not provided"
         )
     );
     return ResponseEntity.ok(profile);
 }

 @PostMapping("/profile")
 public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody Map<String, String> payload) {
     if (authentication == null || authentication.getName() == null) {
         return ResponseEntity.status(401).body("Not authenticated");
     }
     String username = authentication.getName();
     Optional<UserModel> userOpt = userRepository.findByUsername(username);
     if (userOpt.isEmpty()) {
         return ResponseEntity.status(404).body("User not found");
     }
     UserModel user = userOpt.get();
     if (payload.containsKey("fullName")) user.setFullName(payload.get("fullName"));
     if (payload.containsKey("dob")) user.setDob(payload.get("dob"));
     if (payload.containsKey("gender")) user.setGender(payload.get("gender"));
     if (payload.containsKey("phone")) user.setPhone(payload.get("phone"));
     if (payload.containsKey("address")) user.setAddress(payload.get("address"));
     userRepository.save(user);
     return ResponseEntity.ok("Profile updated successfully");
 }

 @PostMapping("/profile/avatar")
 public ResponseEntity<?> uploadAvatar(Authentication authentication, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
     if (authentication == null || authentication.getName() == null) {
         return ResponseEntity.status(401).body("Not authenticated");
     }
     String username = authentication.getName();
     Optional<UserModel> userOpt = userRepository.findByUsername(username);
     if (userOpt.isEmpty()) {
         return ResponseEntity.status(404).body("User not found");
     }
     UserModel user = userOpt.get();
     try {
         user.setAvatar(file.getBytes());
         userRepository.save(user);
         return ResponseEntity.ok("Avatar updated successfully");
     } catch (Exception e) {
         return ResponseEntity.status(500).body("Failed to upload avatar: " + e.getMessage());
     }
 }
}

