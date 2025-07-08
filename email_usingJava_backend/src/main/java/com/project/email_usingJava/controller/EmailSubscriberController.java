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

@RestController
@RequestMapping("/api/subscribers")
@CrossOrigin("*")
public class EmailSubscriberController {

    private static final Logger logger = LoggerFactory.getLogger(EmailSubscriberController.class);

    @Autowired
    private UserSubscriberRepository userSubscriberRepository;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Map<String, String> request, @RequestParam String username) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            
            if (email == null || name == null) {
                return ResponseEntity.badRequest().body("Email and name are required");
            }
            
            // Create user's table if it doesn't exist
            userSubscriberRepository.createUserTable(username);
            
            // Check if email already exists
            if (userSubscriberRepository.emailExists(username, email)) {
                return ResponseEntity.badRequest().body("Subscriber with this email already exists");
            }
            
            // Save the subscriber
            userSubscriberRepository.save(username, email, name);
            
            return ResponseEntity.ok("Subscriber added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to add subscriber: " + e.getMessage());
        }
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam String username) {
        try {
            userSubscriberRepository.delete(username, id);
            return ResponseEntity.ok("Subscriber deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to delete subscriber: " + e.getMessage());
        }
    }

    @PostMapping("/import-csv")
    public ResponseEntity<?> importSubscribersFromCsv(@RequestParam("file") MultipartFile file, Authentication authentication) {
        String username = authentication.getName();
        Set<String> addedEmails = new HashSet<>();
        Set<String> skippedEmails = new HashSet<>();
        int total = 0;
        int added = 0;
        int skipped = 0;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean isHeader = true;
            int emailIdx = -1, nameIdx = -1;
            while ((line = reader.readLine()) != null) {
                String[] tokens = line.split(",");
                if (isHeader) {
                    // Find the index of 'email' and 'name' columns
                    for (int i = 0; i < tokens.length; i++) {
                        String col = tokens[i].trim().toLowerCase();
                        if (col.equals("email")) emailIdx = i;
                        if (col.equals("name")) nameIdx = i;
                    }
                    if (emailIdx == -1 || nameIdx == -1) {
                        return ResponseEntity.badRequest().body("CSV must have 'name' and 'email' columns");
                    }
                    isHeader = false;
                    continue;
                }
                total++;
                String email = tokens[emailIdx].trim();
                String name = tokens[nameIdx].trim();
                if (email.isEmpty() || name.isEmpty()) {
                    skipped++;
                    continue;
                }
                try {
                    userSubscriberRepository.createUserTable(username);
                    // Check for duplicate using emailExists
                    if (userSubscriberRepository.emailExists(username, email) || addedEmails.contains(email.toLowerCase())) {
                        skippedEmails.add(email + " (already exists)");
                        skipped++;
                        continue;
                    }
                    userSubscriberRepository.save(username, email, name);
                    addedEmails.add(email.toLowerCase());
                    added++;
                } catch (Exception e) {
                    e.printStackTrace();
                    skippedEmails.add(email + " (error)");
                    skipped++;
                }
            }
            return ResponseEntity.ok("Imported: " + added + "/" + total + " (skipped: " + skipped + ") Skipped emails: " + skippedEmails);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to import subscribers: " + e.getMessage());
        }
    }
}

