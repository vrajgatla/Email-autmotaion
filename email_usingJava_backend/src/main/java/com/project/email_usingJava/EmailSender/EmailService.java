package com.project.email_usingJava.EmailSender;
//EmailService.java

import java.util.Map;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import jakarta.mail.MessagingException;

public interface EmailService {
 void sendSimpleEmail(String from, String password, String to, String subject, String body);
 void sendEmailWithAttachment(String from, String password, String to, String subject, String body, List<EmailServiceImpl.AttachmentDTO> attachments) throws MessagingException;
 void sendTemplateEmail(String from, String password, String to, String subject, String templateName, Map<String, String> variables, List<EmailServiceImpl.AttachmentDTO> attachments) throws Exception;
}


