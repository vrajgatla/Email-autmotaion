package com.project.email_usingJava.EmailSender;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.email_usingJava.Email.UserSubscriberRepository;
import com.project.email_usingJava.User.UserModel;
import com.project.email_usingJava.User.UserRepository;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin("*")
public class EmailSenderController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserSubscriberRepository userSubscriberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TemplateService templateService;

    private UserModel getCurrentUser(Authentication authentication) {
        try {
            // System.out.println("Authentication: " + authentication);
            // System.out.println("Authentication name: " + (authentication != null ? authentication.getName() : "null"));
            
            if (authentication == null || authentication.getName() == null) {
                throw new RuntimeException("Authentication is null or username is null");
            }
            
            return userRepository.findByUsername(authentication.getName()).orElseThrow(
                    () -> new RuntimeException("User not found: " + authentication.getName())
            );
        } catch (Exception e) {
            // System.err.println("Error in getCurrentUser: " + e.getMessage());
            // e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/templates")
    public ResponseEntity<List<TemplateService.TemplateInfo>> getAvailableTemplates() {
        try {
            List<TemplateService.TemplateInfo> templates = templateService.getAllTemplates();
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            // System.err.println("Error getting templates: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/templates/{templateName}")
    public ResponseEntity<TemplateService.TemplateInfo> getTemplateInfo(@PathVariable String templateName) {
        try {
            TemplateService.TemplateInfo template = templateService.getTemplate(templateName);
            if (template == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(template);
        } catch (Exception e) {
            // System.err.println("Error getting template info: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/test-config")
    public ResponseEntity<String> testEmailConfig(Authentication authentication) {
        try {
            UserModel user = getCurrentUser(authentication);
            // System.out.println("Testing email config for user: " + user.getUsername());
            // System.out.println("User email: " + user.getEmail());
            // System.out.println("App password: " + (user.getAppPassword() != null ? "***" : "null"));
            
            return ResponseEntity.ok("Email configuration loaded successfully. Email: " + user.getEmail() + 
                ", App password length: " + (user.getAppPassword() != null ? user.getAppPassword().length() : 0));
            
        } catch (Exception e) {
            // System.err.println("Error testing email config: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error testing email config: " + e.getMessage());
        }
    }

    @PostMapping("/test-send")
    public ResponseEntity<String> testSendEmail(Authentication authentication) {
        try {
            UserModel user = getCurrentUser(authentication);
            // System.out.println("Testing email send for user: " + user.getUsername());
            
            // Send a test email to the user's own email
            String testSubject = "Test Email from Email Automation System";
            String testBody = "This is a test email to verify that the email system is working correctly.\n\n" +
                            "User: " + user.getUsername() + "\n" +
                            "Email: " + user.getEmail() + "\n" +
                            "App Password Length: " + (user.getAppPassword() != null ? user.getAppPassword().length() : 0) + "\n\n" +
                            "If you receive this email, the system is working properly!";
            
            emailService.sendSimpleEmail(user.getEmail(), user.getAppPassword(), user.getEmail(), testSubject, testBody);
            
            return ResponseEntity.ok("Test email sent successfully to " + user.getEmail());
            
        } catch (Exception e) {
            // System.err.println("Error sending test email: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending test email: " + e.getMessage());
        }
    }

    @GetMapping("/test-app-password")
    public ResponseEntity<String> testAppPassword(Authentication authentication) {
        try {
            UserModel user = getCurrentUser(authentication);
            String appPassword = user.getAppPassword();
            
            if (appPassword == null || appPassword.isEmpty()) {
                return ResponseEntity.badRequest().body("App password is not set. Please set it in your profile.");
            }
            
            if (appPassword.length() != 16) {
                return ResponseEntity.badRequest().body("App password should be exactly 16 characters. Current length: " + appPassword.length());
            }
            
            if (appPassword.contains(" ")) {
                return ResponseEntity.badRequest().body("App password should not contain spaces. Please remove spaces from your app password.");
            }
            
            return ResponseEntity.ok("App password format is correct. Length: " + appPassword.length() + " characters.");
            
        } catch (Exception e) {
            // System.err.println("Error testing app password: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error testing app password: " + e.getMessage());
        }
    }

    @PostMapping("/send-simple")
    public ResponseEntity<String> sendSimple(
            Authentication authentication,
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body) {
        try {
            // System.out.println("sendSimple called with to: " + to + ", subject: " + subject);
            UserModel user = getCurrentUser(authentication);
            // System.out.println("User found: " + user.getUsername() + ", email: " + user.getEmail());
            emailService.sendSimpleEmail(user.getEmail(), user.getAppPassword(), to, subject, body);
            return ResponseEntity.ok("Simple email sent");
        } catch (Exception e) {
            // System.err.println("Error in sendSimple: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }

    @PostMapping("/send-simple-to-all")
    public ResponseEntity<?> sendSimpleToAll(
            Authentication authentication,
            @RequestParam String subject,
            @RequestParam String body) {
        long start = System.currentTimeMillis();
        int total = 0, success = 0, failed = 0;
        List<String> failedEmails = new ArrayList<>();
        try {
            // System.out.println("sendSimpleToAll called with subject: " + subject);
            UserModel user = getCurrentUser(authentication);
            List<Map<String, Object>> subscribers = userSubscriberRepository.findByUsername(user.getUsername());
            total = subscribers.size();
            for (Map<String, Object> subscriber : subscribers) {
                String email = (String) subscriber.get("email");
                try {
                    emailService.sendSimpleEmail(user.getEmail(), user.getAppPassword(), email, subject, body);
                    success++;
                } catch (Exception e) {
                    failed++;
                    failedEmails.add(email);
                }
            }
            long timeMs = System.currentTimeMillis() - start;
            return ResponseEntity.ok(Map.of(
                "total", total,
                "success", success,
                "failed", failed,
                "failedEmails", failedEmails,
                "timeMs", timeMs
            ));
        } catch (Exception e) {
            // System.err.println("Error in sendSimpleToAll: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending email to all: " + e.getMessage());
        }
    }

    @PostMapping("/send-attachment")
    public ResponseEntity<String> sendWithAttachment(
            Authentication authentication,
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body,
            @RequestParam("attachments") MultipartFile[] attachments) throws MessagingException {
        try {
            // System.out.println("sendWithAttachment called with to: " + to + ", subject: " + subject);
            UserModel user = getCurrentUser(authentication);
            List<EmailServiceImpl.AttachmentDTO> attachmentDTOs = new ArrayList<>();
            if (attachments != null) {
                for (MultipartFile file : attachments) {
                    attachmentDTOs.add(new EmailServiceImpl.AttachmentDTO(
                        file.getOriginalFilename(),
                        file.getBytes(),
                        file.getContentType()
                    ));
                }
            }
            emailService.sendEmailWithAttachment(user.getEmail(), user.getAppPassword(), to, subject, body, attachmentDTOs);
            return ResponseEntity.ok("Email with attachment sent");
        } catch (Exception e) {
            // System.err.println("Error in sendWithAttachment: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending email with attachment: " + e.getMessage());
        }
    }

    @PostMapping("/send-attachment-to-all")
    public ResponseEntity<?> sendAttachmentToAll(
            Authentication authentication,
            @RequestParam String subject,
            @RequestParam String body,
            @RequestParam("attachments") MultipartFile[] attachments) throws MessagingException {
        long start = System.currentTimeMillis();
        int total = 0, success = 0, failed = 0;
        List<String> failedEmails = new ArrayList<>();
        try {
            // System.out.println("sendAttachmentToAll called with subject: " + subject);
            UserModel user = getCurrentUser(authentication);
            List<Map<String, Object>> subscribers = userSubscriberRepository.findByUsername(user.getUsername());
            total = subscribers.size();
            List<EmailServiceImpl.AttachmentDTO> attachmentDTOs = new ArrayList<>();
            if (attachments != null) {
                for (MultipartFile file : attachments) {
                    attachmentDTOs.add(new EmailServiceImpl.AttachmentDTO(
                        file.getOriginalFilename(),
                        file.getBytes(),
                        file.getContentType()
                    ));
                }
            }
            for (Map<String, Object> subscriber : subscribers) {
                String email = (String) subscriber.get("email");
                try {
                    emailService.sendEmailWithAttachment(user.getEmail(), user.getAppPassword(), email, subject, body, attachmentDTOs);
                    success++;
                } catch (Exception e) {
                    failed++;
                    failedEmails.add(email);
                }
            }
            long timeMs = System.currentTimeMillis() - start;
            return ResponseEntity.ok(Map.of(
                "total", total,
                "success", success,
                "failed", failed,
                "failedEmails", failedEmails,
                "timeMs", timeMs
            ));
        } catch (Exception e) {
            // System.err.println("Error in sendAttachmentToAll: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending email with attachment to all: " + e.getMessage());
        }
    }

    @PostMapping("/send-template")
    public ResponseEntity<String> sendTemplate(
            Authentication authentication,
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String templateName,
            @RequestPart(required = false) MultipartFile[] attachments,
            @RequestBody Map<String, String> variables) throws Exception {
        try {
            // System.out.println("sendTemplate called with to: " + to + ", subject: " + subject + ", template: " + templateName);
            // Validate template exists
            if (!templateService.templateExists(templateName)) {
                return ResponseEntity.badRequest().body("Template not found: " + templateName);
            }
            UserModel user = getCurrentUser(authentication);
            List<EmailServiceImpl.AttachmentDTO> attachmentDTOs = new ArrayList<>();
            if (attachments != null) {
                for (MultipartFile file : attachments) {
                    attachmentDTOs.add(new EmailServiceImpl.AttachmentDTO(
                        file.getOriginalFilename(),
                        file.getBytes(),
                        file.getContentType()
                    ));
                }
            }
            emailService.sendTemplateEmail(user.getEmail(), user.getAppPassword(), to, subject, templateName, variables, attachmentDTOs);
            return ResponseEntity.ok("Template email sent");
        } catch (Exception e) {
            // System.err.println("Error in sendTemplate: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending template email: " + e.getMessage());
        }
    }

    @PostMapping("/send-template-to-all")
    public ResponseEntity<?> sendTemplateToAll(
            Authentication authentication,
            @RequestParam String subject,
            @RequestParam String templateName,
            @RequestPart(required = false) MultipartFile[] attachments,
            @RequestBody Map<String, String> variables) throws Exception {
        long start = System.currentTimeMillis();
        int total = 0;
        AtomicInteger success = new AtomicInteger(0);
        AtomicInteger failed = new AtomicInteger(0);
        List<String> failedEmails = new ArrayList<>();
        try {
            // System.out.println("sendTemplateToAll called with subject: " + subject + ", template: " + templateName);
            // Validate template exists
            if (!templateService.templateExists(templateName)) {
                return ResponseEntity.badRequest().body("Template not found: " + templateName);
            }
            UserModel user = getCurrentUser(authentication);
            List<Map<String, Object>> subscribers = userSubscriberRepository.findByUsername(user.getUsername());
            total = subscribers.size();
            List<EmailServiceImpl.AttachmentDTO> attachmentDTOs = new ArrayList<>();
            if (attachments != null) {
                for (MultipartFile file : attachments) {
                    attachmentDTOs.add(new EmailServiceImpl.AttachmentDTO(
                        file.getOriginalFilename(),
                        file.getBytes(),
                        file.getContentType()
                    ));
                }
            }
            ArrayList<CompletableFuture<?>> futures = new ArrayList<>();
            for (Map<String, Object> subscriber : subscribers) {
                String email = (String) subscriber.get("email");
                futures.add(CompletableFuture.runAsync(() -> {
                    try {
                        emailService.sendTemplateEmail(user.getEmail(), user.getAppPassword(), email, subject, templateName, variables, attachmentDTOs);
                        success.incrementAndGet();
                    } catch (Exception e) {
                        failed.incrementAndGet();
                        synchronized (failedEmails) { failedEmails.add(email); }
                        // System.err.println("Error sending template email to " + email + ": " + e.getMessage());
                        // e.printStackTrace();
                    }
                }));
            }
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
            long timeMs = System.currentTimeMillis() - start;
            return ResponseEntity.ok(Map.of(
                "total", total,
                "success", success.get(),
                "failed", failed.get(),
                "failedEmails", failedEmails,
                "timeMs", timeMs
            ));
        } catch (Exception e) {
            // System.err.println("Error in sendTemplateToAll: " + e.getMessage());
            // e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending template email to all: " + e.getMessage());
        }
    }
}
