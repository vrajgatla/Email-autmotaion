//package com.project.email_usingJava;
//
//import java.io.InputStream;
//import java.nio.charset.StandardCharsets;
//import java.util.Objects;
//
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import jakarta.mail.internet.MimeMessage;
//
//@RestController
//public class EmailController1 {
//	
//	private final JavaMailSender mailSender;
//
//	public EmailController1(JavaMailSender mailSender) {
//		this.mailSender = mailSender;
//	}
//	
//	
////	@RequestMapping("/send-email")
////	public String sendEmail() {
////		
////		try{
////			SimpleMailMessage message = new SimpleMailMessage();
////			
////		message.setFrom("hunter6not@gmail.com");
////		message.setTo("bro96864@gmail.com");
////		message.setSubject("simple test email from hunter");
////		message.setText("this is a sample email body for my first email");
////		
////		mailSender.send(message);
////		
////	return "success";	
////	}
////		catch(Exception e) {
////			return e.getMessage();
////		}
////	}
////	
//	
////	@RequestMapping("/send-email-with-Attachment")
////	public String sendEmailWithAttachment() {
////		
////		try{
////			MimeMessage message = mailSender.createMimeMessage();
////			MimeMessageHelper helper = new MimeMessageHelper(message,true);
////			
////			
////		helper.setFrom("hunter6not@gmail.com");
////		helper.setTo("bro96864@gmail.com");
////		helper.setSubject("simple test email from hunter");
////		helper.setText("this is a sample email body for my first email");
////		
////		helper.addAttachment("resume.pdf", new File("C:\\Users\\Hai\\Desktop\\New folder\\1-resume.pdf"));
////		helper.addAttachment(".png image", new File("C:\\Users\\Hai\\Desktop\\New folder\\2-image.png"));
////		
////		mailSender.send(message);
////		
////	return "success";	
////	}
////		catch(Exception e) {
////			return e.getMessage();
////		}
////	}
//	
////	@RequestMapping("/send-html-email")
////	public String sendHtmlEmail() {
////		
////		try{
////			MimeMessage message = mailSender.createMimeMessage();
////			MimeMessageHelper helper = new MimeMessageHelper(message,true);
////			
////			
////		helper.setFrom("hunter6not@gmail.com");
////		helper.setTo("bro96864@gmail.com");
////		helper.setSubject("simple test email from hunter");
////		
////		try(var inputSystem = Objects.requireNonNull(EmailController1.class.getResourceAsStream("/templates/index.html"))){
////		 helper.setText(new String(InputStream.readAllBytes().StandardCharsets.UTF_8),true)
////		 }
////		}
////		
////		mailSender.send(message);
////		
////	return "success";	
////	}
////		catch(Exception e) {
////			return e.getMessage();
////		}
////	}
//	@RequestMapping("/send-html-email")
//	public String sendHtmlEmail() {
//	    try {
//	        MimeMessage message = mailSender.createMimeMessage();
//	        MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//	        helper.setFrom("hunter6not@gmail.com");
//	        helper.setTo("bro96864@gmail.com");
//	        helper.setSubject("Simple test email from Hunter");
//
//	        String htmlContent;
//	        try (InputStream inputStream = Objects.requireNonNull(
//	                getClass().getClassLoader().getResourceAsStream("templates/index.html"))) {
//	            htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
//	        }
//
//	        helper.setText(htmlContent, true); // Ensure this is outside the inner try block
//
//	        mailSender.send(message); // Also outside
//
//	        return "success";
//
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	        return e.getMessage();
//	    }
//	}
//
//
//}
