package com.project.email_usingJava.EmailSender;



import com.project.email_usingJava.Email.EmailSubscriber;
import com.project.email_usingJava.Email.EmailSubscriberRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin("*")
public class EmailSenderController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailSubscriberRepository subscriberRepository;

    @PostMapping("/send-simple")
    public ResponseEntity<String> sendSimple(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body) {
        emailService.sendSimpleEmail(to, subject, body);
        return ResponseEntity.ok("Simple email sent");
    }

    @PostMapping("/send-simple-to-all")
    public ResponseEntity<String> sendSimpleToAll(
            @RequestParam String subject,
            @RequestParam String body) {
        List<EmailSubscriber> subscribers = subscriberRepository.findAll();
        for (EmailSubscriber subscriber : subscribers) {
            emailService.sendSimpleEmail(subscriber.getEmail(), subject, body);
        }
        return ResponseEntity.ok("Simple email sent to all");
    }

    @PostMapping("/send-attachment")
    public ResponseEntity<String> sendWithAttachment(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body,
            @RequestParam("attachments") MultipartFile[] attachments) throws MessagingException {
        emailService.sendEmailWithAttachment(to, subject, body, attachments);
        return ResponseEntity.ok("Email with attachment sent");
    }

    @PostMapping("/send-attachment-to-all")
    public ResponseEntity<String> sendAttachmentToAll(
            @RequestParam String subject,
            @RequestParam String body,
            @RequestParam("attachments") MultipartFile[] attachments) throws MessagingException {
        List<EmailSubscriber> subscribers = subscriberRepository.findAll();
        for (EmailSubscriber subscriber : subscribers) {
            emailService.sendEmailWithAttachment(subscriber.getEmail(), subject, body, attachments);
        }
        return ResponseEntity.ok("Email with attachments sent to all");
    }

    @PostMapping("/send-template")
    public ResponseEntity<String> sendTemplate(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String templateName,
            @RequestBody Map<String, String> variables) throws Exception {
        emailService.sendTemplateEmail(to, subject, templateName, variables);
        return ResponseEntity.ok("Template email sent");
    }

    @PostMapping("/send-template-to-all")
    public ResponseEntity<String> sendTemplateToAll(
            @RequestParam String subject,
            @RequestParam String templateName,
            @RequestBody Map<String, String> variables) throws Exception {
        List<EmailSubscriber> subscribers = subscriberRepository.findAll();
        for (EmailSubscriber subscriber : subscribers) {
            emailService.sendTemplateEmail(subscriber.getEmail(), subject, templateName, variables);
        }
        return ResponseEntity.ok("Template email sent to all");
    }
}
