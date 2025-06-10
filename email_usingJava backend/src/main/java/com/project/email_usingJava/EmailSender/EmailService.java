package com.project.email_usingJava.EmailSender;


import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String body);
    void sendEmailWithAttachment(String to, String subject, String body, MultipartFile[] attachments) throws MessagingException;
    void sendTemplateEmail(String to, String subject, String templateName, Map<String, String> variables) throws Exception;
}

