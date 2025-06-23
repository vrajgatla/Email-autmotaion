package com.project.email_usingJava.EmailSender;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.util.Map;
import java.util.Properties;

import jakarta.mail.Authenticator;
// EmailServiceImpl.java
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
	private TemplateEngine templateEngine;

	private Session getSession(String from, String password) {
		System.out.println("Creating SMTP session for: " + from);
		System.out.println("App password length: " + (password != null ? password.length() : "null"));
		
		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");
		props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
		props.put("mail.smtp.connectiontimeout", "10000");
		props.put("mail.smtp.timeout", "10000");
		props.put("mail.debug", "true"); // Enable debug mode

		return Session.getInstance(props, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				System.out.println("Authenticating with email: " + from);
				return new PasswordAuthentication(from, password);
			}
		});
	}
    @Override
    public void sendSimpleEmail(String from, String password, String to, String subject, String body) {
        try {
            System.out.println("Attempting to send simple email:");
            System.out.println("From: " + from);
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body length: " + body.length());
            
            Session session = getSession(from, password);
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(body);
            
            System.out.println("Sending email...");
            Transport.send(message);
            System.out.println("Email sent successfully!");
            
        } catch (MessagingException e) {
            System.err.println("Error sending simple email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Unexpected error sending email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unexpected error sending email: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendEmailWithAttachment(String from, String password, String to, String subject, String body, MultipartFile[] attachments) throws MessagingException {
        try {
            System.out.println("Attempting to send email with attachment:");
            System.out.println("From: " + from);
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Attachments: " + attachments.length);
            
            Session session = getSession(from, password);
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);

            MimeBodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setText(body);

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);

            for (MultipartFile file : attachments) {
                System.out.println("Adding attachment: " + file.getOriginalFilename());
                MimeBodyPart attachPart = new MimeBodyPart();
                attachPart.setFileName(file.getOriginalFilename());
                attachPart.setContent(file.getBytes(), file.getContentType());
                multipart.addBodyPart(attachPart);
            }

            message.setContent(multipart);
            
            System.out.println("Sending email with attachment...");
            Transport.send(message);
            System.out.println("Email with attachment sent successfully!");
            
        } catch (MessagingException e) {
            System.err.println("Error sending email with attachment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        } catch (IOException e) {
            System.err.println("Error reading attachment: " + e.getMessage());
            e.printStackTrace();
            throw new MessagingException("Error reading attachment: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Unexpected error sending email with attachment: " + e.getMessage());
            e.printStackTrace();
            throw new MessagingException("Unexpected error: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendTemplateEmail(String from, String password, String to, String subject, String templateName, Map<String, String> variables) throws Exception {
        try {
            System.out.println("Attempting to send template email:");
            System.out.println("From: " + from);
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Template: " + templateName);
            System.out.println("Variables: " + variables);
            
            // Create Thymeleaf context and add variables
            Context context = new Context();
            if (variables != null) {
                for (Map.Entry<String, String> entry : variables.entrySet()) {
                    context.setVariable(entry.getKey(), entry.getValue());
                }
            }
            
            // Process the template
            String htmlContent = templateEngine.process(templateName, context);
            System.out.println("Template processed successfully. Content length: " + htmlContent.length());
            
            // Send HTML email
            Session session = getSession(from, password);
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            
            // Set content as HTML
            message.setContent(htmlContent, "text/html; charset=UTF-8");
            
            System.out.println("Sending template email...");
            Transport.send(message);
            System.out.println("Template email sent successfully!");
            
        } catch (Exception e) {
            System.err.println("Error sending template email: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}