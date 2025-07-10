package com.project.email_usingJava.Config;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.HashMap;

/**
 * Configuration class for template auto-population settings.
 * Modify this class to change which variables are auto-populated for each template.
 */
@Component
public class TemplateAutoPopulateConfig {
    
    /**
     * Get auto-population configuration for all templates.
     * Modify this method to change auto-population settings.
     */
    public Map<String, Map<String, String>> getAutoPopulateConfig() {
        Map<String, Map<String, String>> config = new HashMap<>();
        
        // Feedback Request Email
        Map<String, String> feedbackConfig = new HashMap<>();
        feedbackConfig.put("recipientName", "subscriber.name");
        config.put("feedback_request", feedbackConfig);
        
        // Internship/Job Request Email
        Map<String, String> internshipConfig = new HashMap<>();
        internshipConfig.put("recipientName", "subscriber.name");
        internshipConfig.put("studentName", "user.fullName");
        internshipConfig.put("email", "user.email");
        internshipConfig.put("phone", "user.phone");
        config.put("internship_job_request", internshipConfig);
        
        // Freelancer Service Pitch Email
        Map<String, String> freelancerConfig = new HashMap<>();
        freelancerConfig.put("clientName", "subscriber.name");
        freelancerConfig.put("freelancerName", "user.fullName");
        config.put("freelancer_service_pitch", freelancerConfig);
        
        // Tutoring/Coaching Offer Email
        Map<String, String> tutoringConfig = new HashMap<>();
        tutoringConfig.put("studentName", "subscriber.name");
        tutoringConfig.put("tutorName", "user.fullName");
        config.put("tutoring_coaching_offer", tutoringConfig);
        
        // Local Product/Service Promo Email
        Map<String, String> localPromoConfig = new HashMap<>();
        localPromoConfig.put("customerName", "subscriber.name");
        localPromoConfig.put("businessName", "user.fullName");
        config.put("local_product_service_promo", localPromoConfig);
        
        return config;
    }
    
    /**
     * Available data sources for auto-population:
     * - "subscriber.name" - Subscriber's name
     * - "subscriber.email" - Subscriber's email
     * - "user.fullName" - User's full name
     * - "user.email" - User's email
     * - "user.phone" - User's phone number
     */
    public static final class DataSources {
        public static final String SUBSCRIBER_NAME = "subscriber.name";
        public static final String SUBSCRIBER_EMAIL = "subscriber.email";
        public static final String USER_FULL_NAME = "user.fullName";
        public static final String USER_EMAIL = "user.email";
        public static final String USER_PHONE = "user.phone";
    }
} 