package com.project.email_usingJava.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.HashMap;

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

import com.project.email_usingJava.model.UserModel;
import com.project.email_usingJava.repository.UserSubscriberRepository;
import com.project.email_usingJava.repository.UserRepository;
import com.project.email_usingJava.service.EmailService;
import com.project.email_usingJava.service.TemplateService;
import com.project.email_usingJava.ServiceImpl.EmailServiceImpl;
import com.project.email_usingJava.exception.*;

import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin("*")
public class EmailSenderController {

    private static final Logger logger = LoggerFactory.getLogger(EmailSenderController.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserSubscriberRepository userSubscriberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TemplateService templateService;

    @Autowired
    private TemplateEngine templateEngine;

    private UserModel getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedException("Authentication is null or username is null");
        }
        return userRepository.findByUsername(authentication.getName()).orElseThrow(
                () -> new UserNotFoundException("User not found: " + authentication.getName())
        );
    }

    @GetMapping("/templates")
    public ResponseEntity<List<TemplateService.TemplateInfo>> getAvailableTemplates() {
        try {
            List<TemplateService.TemplateInfo> templates = templateService.getAllTemplates();
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            throw new TemplateNotFoundException("Error getting templates: " + e.getMessage());
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
            UserModel user = getCurrentUser(authentication);
            emailService.sendSimpleEmail(user.getEmail(), user.getAppPassword(), to, subject, body);
            // Increment sentEmails by 1
            user.setSentEmails(user.getSentEmails() + 1);
            userRepository.save(user);
            return ResponseEntity.ok("Simple email sent");
        } catch (Exception e) {
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
            UserModel user = getCurrentUser(authentication);
            List<Map<String, Object>> subscribers = userSubscriberRepository.findByUsername(user.getUsername());
            if (subscribers.isEmpty()) {
                throw new NoSubscribersException("There are no subscribers to send email to.");
            }
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
            // Increment sentEmails by number of successful sends
            user.setSentEmails(user.getSentEmails() + success);
            userRepository.save(user);
            long timeMs = System.currentTimeMillis() - start;
            return ResponseEntity.ok(Map.of(
                "total", total,
                "success", success,
                "failed", failed,
                "failedEmails", failedEmails,
                "timeMs", timeMs
            ));
        } catch (NoSubscribersException e) {
            throw e;
        } catch (Exception e) {
            throw new EmailSendException("Error sending email to all: " + e.getMessage());
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
            // Increment sentEmails by 1
            user.setSentEmails(user.getSentEmails() + 1);
            userRepository.save(user);
            return ResponseEntity.ok("Email with attachment sent");
        } catch (Exception e) {
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
            // Increment sentEmails by number of successful sends
            user.setSentEmails(user.getSentEmails() + success);
            userRepository.save(user);
            long timeMs = System.currentTimeMillis() - start;
            return ResponseEntity.ok(Map.of(
                "total", total,
                "success", success,
                "failed", failed,
                "failedEmails", failedEmails,
                "timeMs", timeMs
            ));
        } catch (Exception e) {
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
            // Increment sentEmails by 1
            user.setSentEmails(user.getSentEmails() + 1);
            userRepository.save(user);
            return ResponseEntity.ok("Template email sent");
        } catch (Exception e) {
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
                String name = (String) subscriber.get("name");
                futures.add(CompletableFuture.runAsync(() -> {
                    try {
                        Map<String, String> mergedVars = new HashMap<>(variables);
                        
                        // Auto-populate common variables from subscriber and user data
                        mergedVars.put("receiverName", name);
                        mergedVars.put("receiverEmail", email);
                        mergedVars.put("senderName", user.getFullName());
                        mergedVars.put("senderEmail", user.getEmail());
                        
                        // Auto-populate variables based on template configuration
                        TemplateService.TemplateInfo templateInfo = templateService.getTemplate(templateName);
                        if (templateInfo != null && templateInfo.getAutoPopulatedVariables() != null) {
                            for (Map.Entry<String, String> entry : templateInfo.getAutoPopulatedVariables().entrySet()) {
                                String variableName = entry.getKey();
                                String source = entry.getValue();
                                
                                switch (source) {
                                    case "subscriber.name":
                                        mergedVars.put(variableName, name);
                                        break;
                                    case "subscriber.email":
                                        mergedVars.put(variableName, email);
                                        break;
                                    case "user.fullName":
                                        mergedVars.put(variableName, user.getFullName());
                                        break;
                                    case "user.email":
                                        mergedVars.put(variableName, user.getEmail());
                                        break;
                                    case "user.phone":
                                        if (user.getPhone() != null) {
                                            mergedVars.put(variableName, user.getPhone());
                                        }
                                        break;
                                }
                            }
                        }
                        
                        emailService.sendTemplateEmail(user.getEmail(), user.getAppPassword(), email, subject, templateName, mergedVars, attachmentDTOs);
                        success.incrementAndGet();
                    } catch (Exception e) {
                        failed.incrementAndGet();
                        synchronized (failedEmails) { failedEmails.add(email); }
                    }
                }));
            }
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
            // Increment sentEmails by number of successful sends
            user.setSentEmails(user.getSentEmails() + success.get());
            userRepository.save(user);
            long timeMs = System.currentTimeMillis() - start;
            return ResponseEntity.ok(Map.of(
                "total", total,
                "success", success.get(),
                "failed", failed.get(),
                "failedEmails", failedEmails,
                "timeMs", timeMs
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error in sendTemplateToAll: " + e.getMessage());
        }
    }

    /**
     * Live preview: Render a template with sample data for previewing in the frontend.
     */
    @GetMapping(value = "/templates/{templateName}/render", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> renderTemplatePreview(@PathVariable String templateName) {
        try {
            System.out.println("[PREVIEW] Attempting to render template: '" + templateName + "'");
            TemplateService.TemplateInfo template = templateService.getTemplate(templateName);
            if (template == null) {
                System.err.println("[PREVIEW] Template not found in TemplateService: '" + templateName + "'");
                return ResponseEntity.status(404).body("Template not found: " + templateName);
            }
            // Build sample variables map
            Map<String, Object> sampleVars = new java.util.HashMap<>();
            for (String var : template.getVariables()) {
                sampleVars.put(var, var.substring(0, 1).toUpperCase() + var.substring(1) + " Sample");
            }
            // Add some common sample values for known variables
            if (sampleVars.containsKey("name")) sampleVars.put("name", "John Doe");
            if (sampleVars.containsKey("company")) sampleVars.put("company", "Acme Corp");
            if (sampleVars.containsKey("website")) sampleVars.put("website", "https://acme.com");
            if (sampleVars.containsKey("supportEmail")) sampleVars.put("supportEmail", "support@acme.com");
            if (sampleVars.containsKey("date")) sampleVars.put("date", "April 1, 2025");
            if (sampleVars.containsKey("discountPercent")) sampleVars.put("discountPercent", "20");
            if (sampleVars.containsKey("offerDescription")) sampleVars.put("offerDescription", "Spring Sale");
            if (sampleVars.containsKey("promoCode")) sampleVars.put("promoCode", "SPRING2025");
            if (sampleVars.containsKey("ctaLink")) sampleVars.put("ctaLink", "https://acme.com/deals");
            if (sampleVars.containsKey("expiryDate")) sampleVars.put("expiryDate", "April 30, 2025");
            if (sampleVars.containsKey("highlight1")) sampleVars.put("highlight1", "Feature One");
            if (sampleVars.containsKey("highlight2")) sampleVars.put("highlight2", "Feature Two");
            if (sampleVars.containsKey("highlight3")) sampleVars.put("highlight3", "Feature Three");
            if (sampleVars.containsKey("newsContent")) sampleVars.put("newsContent", "Latest news and updates here.");
            if (sampleVars.containsKey("proTip")) sampleVars.put("proTip", "Try our new dashboard!");
            if (sampleVars.containsKey("unsubscribeLink")) sampleVars.put("unsubscribeLink", "https://acme.com/unsubscribe");
            // Render with Thymeleaf
            org.thymeleaf.context.Context context = new org.thymeleaf.context.Context();
            for (Map.Entry<String, Object> entry : sampleVars.entrySet()) {
                context.setVariable(entry.getKey(), entry.getValue());
            }
            // Log the template file existence in resources
            String resourcePath = "/templates/" + templateName + ".html";
            java.net.URL resourceUrl = getClass().getResource(resourcePath);
            if (resourceUrl == null) {
                System.err.println("[PREVIEW] Template file not found in resources: '" + resourcePath + "'");
            } else {
                System.out.println("[PREVIEW] Template file found at: " + resourceUrl);
            }
            String html = templateEngine.process(templateName, context);
            return ResponseEntity.ok(html);
        } catch (Exception e) {
            System.err.println("[PREVIEW] Error rendering template: " + templateName);
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error rendering template: " + e.getMessage());
        }
    }
}
