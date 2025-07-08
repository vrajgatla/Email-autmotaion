package com.project.email_usingJava.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.project.email_usingJava.service.EmailService;

import org.springframework.scheduling.annotation.Async;

import java.util.Map;
import java.util.Properties;
import java.util.List;

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
		// System.out.println("Creating SMTP session for: " + from);
		// System.out.println("App password length: " + (password != null ? password.length() : "null"));
		
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
				// System.out.println("Authenticating with email: " + from);
				return new PasswordAuthentication(from, password);
			}
		});
	}

	public static class AttachmentDTO {
		private String filename;
		private byte[] data;
		private String contentType;
		public AttachmentDTO(String filename, byte[] data, String contentType) {
			this.filename = filename;
			this.data = data;
			this.contentType = contentType;
		}
		public String getFilename() { return filename; }
		public byte[] getData() { return data; }
		public String getContentType() { return contentType; }
	}

    @Override
    @Async
    public void sendSimpleEmail(String from, String password, String to, String subject, String body) {
        try {
            // System.out.println("Attempting to send simple email:");
            // System.out.println("From: " + from);
            // System.out.println("To: " + to);
            // System.out.println("Subject: " + subject);
            // System.out.println("Body length: " + body.length());
            
            Session session = getSession(from, password);
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(body);
            
            // System.out.println("Sending email...");
            Transport.send(message);
            System.out.println("Email sent successfully!");
            
        } catch (MessagingException e) {
            // System.err.println("Error sending simple email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        } catch (Exception e) {
            // System.err.println("Unexpected error sending email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unexpected error sending email: " + e.getMessage(), e);
        }
    }

    @Override
    @Async
    public void sendEmailWithAttachment(String from, String password, String to, String subject, String body, List<AttachmentDTO> attachments) throws MessagingException {
        try {
            // System.out.println("Attempting to send email with attachment:");
            // System.out.println("From: " + from);
            // System.out.println("To: " + to);
            // System.out.println("Subject: " + subject);
            // System.out.println("Attachments: " + (attachments != null ? attachments.size() : 0));
            
            Session session = getSession(from, password);
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);

            MimeBodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setText(body);

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);

            if (attachments != null) {
                for (AttachmentDTO att : attachments) {
                    // System.out.println("Adding attachment: " + att.getFilename());
                    MimeBodyPart attachPart = new MimeBodyPart();
                    attachPart.setFileName(att.getFilename());
                    attachPart.setContent(att.getData(), att.getContentType());
                    multipart.addBodyPart(attachPart);
                }
            }

            message.setContent(multipart);
            
            // System.out.println("Sending email with attachment...");
            Transport.send(message);
            System.out.println("Email with attachment sent successfully!");
            
        } catch (MessagingException e) {
            // System.err.println("Error sending email with attachment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            // System.err.println("Unexpected error sending email with attachment: " + e.getMessage());
            e.printStackTrace();
            throw new MessagingException("Unexpected error: " + e.getMessage(), e);
        }
    }

    @Override
    @Async
    public void sendTemplateEmail(String from, String password, String to, String subject, String templateName, Map<String, String> variables, List<AttachmentDTO> attachments) throws Exception {
        try {
            // System.out.println("Attempting to send template email:");
            // System.out.println("From: " + from);
            // System.out.println("To: " + to);
            // System.out.println("Subject: " + subject);
            // System.out.println("Template: " + templateName);
            // System.out.println("Variables: " + variables);
            
            // Create Thymeleaf context and add variables
            Context context = new Context();
            if (variables != null) {
                for (Map.Entry<String, String> entry : variables.entrySet()) {
                    context.setVariable(entry.getKey(), entry.getValue());
                }
            }
            
            // Process the template
            String htmlContent = templateEngine.process(templateName, context);
            // System.out.println("Template processed successfully. Content length: " + htmlContent.length());
            
            Session session = getSession(from, password);
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            
            if (attachments != null && attachments.size() > 0) {
                // Send as multipart with attachments
                MimeBodyPart htmlBodyPart = new MimeBodyPart();
                htmlBodyPart.setContent(htmlContent, "text/html; charset=UTF-8");
                Multipart multipart = new MimeMultipart();
                multipart.addBodyPart(htmlBodyPart);
                for (AttachmentDTO att : attachments) {
                    // System.out.println("Adding attachment: " + att.getFilename());
                    MimeBodyPart attachPart = new MimeBodyPart();
                    attachPart.setFileName(att.getFilename());
                    attachPart.setContent(att.getData(), att.getContentType());
                    multipart.addBodyPart(attachPart);
                }
                message.setContent(multipart);
            } else {
                // Send as HTML only
                message.setContent(htmlContent, "text/html; charset=UTF-8");
            }
            
            // System.out.println("Sending template email...");
            Transport.send(message);
            System.out.println("Template email sent successfully!");
            
        } catch (Exception e) {
            System.err.println("Error sending template email: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}