package com.project.email_usingJava.controller;

import com.project.email_usingJava.repository.UserSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.project.email_usingJava.exception.*;
import com.project.email_usingJava.model.UserModel;
import com.project.email_usingJava.repository.UserRepository;

@RestController
@RequestMapping("/api/subscribers")
@CrossOrigin("*")
public class EmailSubscriberController {

    private static final Logger logger = LoggerFactory.getLogger(EmailSubscriberController.class);

    @Autowired
    private UserSubscriberRepository userSubscriberRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addSubscriber(@RequestBody Map<String, String> payload, Authentication authentication) {
        String email = payload.get("email");
        String name = payload.getOrDefault("name", "");
        UserModel user = getCurrentUser(authentication);
        if (email == null || email.isEmpty()) {
            throw new InvalidInputException("Email is required.");
        }
        if (userSubscriberRepository.emailExists(user.getUsername(), email)) {
            throw new DuplicateSubscriberException("Subscriber already exists.");
        }
        userSubscriberRepository.save(user.getUsername(), email, name);
        return ResponseEntity.ok("Subscriber added successfully");
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam String username, @RequestHeader Map<String, String> headers) {
        System.out.println("[DEBUG] Received GET /api/subscribers for username: " + username);
        System.out.println("[DEBUG] Headers: " + headers);
        try {
            // Create user's table if it doesn't exist
            userSubscriberRepository.createUserTable(username);
            
            List<Map<String, Object>> subscribers = userSubscriberRepository.findByUsername(username);
            return ResponseEntity.ok(subscribers);
        } catch (Exception e) {
            logger.error("Error in getSubscribers: ", e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, String> request, @RequestParam String username) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            
            if (email == null || name == null) {
                return ResponseEntity.badRequest().body("Email and name are required");
            }
            
            userSubscriberRepository.update(username, id, email, name);
            return ResponseEntity.ok("Subscriber updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update subscriber: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteSubscriber(@PathVariable String email, Authentication authentication) {
        UserModel user = getCurrentUser(authentication);
        if (!userSubscriberRepository.emailExists(user.getUsername(), email)) {
            throw new SubscriberNotFoundException("Subscriber not found.");
        }
        // Find the subscriber's ID by email
        List<Map<String, Object>> subscribers = userSubscriberRepository.findByUsername(user.getUsername());
        Long idToDelete = null;
        for (Map<String, Object> sub : subscribers) {
            if (sub.get("email").toString().equalsIgnoreCase(email)) {
                idToDelete = ((Number) sub.get("id")).longValue();
                break;
            }
        }
        if (idToDelete == null) {
            throw new SubscriberNotFoundException("Subscriber not found.");
        }
        userSubscriberRepository.delete(user.getUsername(), idToDelete);
        return ResponseEntity.ok("Subscriber deleted successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubscriberById(@PathVariable Long id, Authentication authentication) {
        UserModel user = getCurrentUser(authentication);
        userSubscriberRepository.delete(user.getUsername(), id);
        return ResponseEntity.ok("Subscriber deleted successfully");
    }

    @PostMapping("/import-csv")
    public ResponseEntity<String> importSubscribersCsv(@RequestParam("file") MultipartFile file, Authentication authentication) {
        String username = getCurrentUser(authentication).getUsername();
        if (file.isEmpty()) {
            throw new FileUploadException("Uploaded file is empty.");
        }
        if (!file.getOriginalFilename().endsWith(".csv")) {
            throw new FileUploadException("Only CSV files are supported.");
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null || !headerLine.toLowerCase().contains("email")) {
                throw new CsvHeaderException("CSV file must contain 'email' column.");
            }
            // ... (rest of CSV import logic, throw CsvFormatException or CsvProcessingException as needed)
        } catch (CsvHeaderException | CsvFormatException | CsvProcessingException e) {
            throw e;
        } catch (Exception e) {
            throw new CsvProcessingException("Error processing the uploaded CSV file: " + e.getMessage());
        }
        return ResponseEntity.ok("CSV import completed");
    }

    private UserModel getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }
}

