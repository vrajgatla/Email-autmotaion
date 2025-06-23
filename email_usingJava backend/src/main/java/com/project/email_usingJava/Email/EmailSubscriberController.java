package com.project.email_usingJava.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscribers")
@CrossOrigin("*")
public class EmailSubscriberController {

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
            
            // Save the subscriber
            userSubscriberRepository.save(username, email, name);
            
            return ResponseEntity.ok("Subscriber added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add subscriber: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam String username) {
        try {
            // Create user's table if it doesn't exist
            userSubscriberRepository.createUserTable(username);
            
            List<Map<String, Object>> subscribers = userSubscriberRepository.findByUsername(username);
            return ResponseEntity.ok(subscribers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch subscribers: " + e.getMessage());
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
            return ResponseEntity.badRequest().body("Failed to update subscriber: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam String username) {
        try {
            userSubscriberRepository.delete(username, id);
            return ResponseEntity.ok("Subscriber deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete subscriber: " + e.getMessage());
        }
    }
}

