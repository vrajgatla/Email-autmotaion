package com.project.email_usingJava.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.project.email_usingJava.Config.TemplateAutoPopulateConfig;
import java.util.*;

@Service
public class TemplateService {
    
    private final Map<String, TemplateInfo> availableTemplates = new HashMap<>();
    private final TemplateAutoPopulateConfig autoPopulateConfig;
    
    @Autowired
    public TemplateService(TemplateAutoPopulateConfig autoPopulateConfig) {
        this.autoPopulateConfig = autoPopulateConfig;
        initializeTemplates();
    }
    
    private void initializeTemplates() {
        Map<String, Map<String, String>> config = this.autoPopulateConfig.getAutoPopulateConfig();
        
        // Internship/Job Request Email
        TemplateInfo internship = new TemplateInfo();
        internship.setName("internship_job_request");
        internship.setDisplayName("Internship/Job Request Email");
        internship.setDescription("Professional email template for students seeking internships or jobs. Includes sender and receiver details, position, and a custom message.");
        internship.setVariables(Arrays.asList(
            "recipientName", "studentName", "degree", "university", "position", "company", "fieldIndustry", "skills", "email", "phone"
        ));
        internship.setAutoPopulatedVariables(config.get("internship_job_request"));
        internship.setPreview("Dear [recipientName],\nI am [studentName] ([email]) applying for [position] at [company].\n[skills]\nBest, [studentName]");
        availableTemplates.put("internship_job_request", internship);

        // Feedback Request Email
        TemplateInfo feedback = new TemplateInfo();
        feedback.setName("feedback_request");
        feedback.setDisplayName("Feedback Request Email");
        feedback.setDescription("Template for requesting feedback from clients, students, or colleagues. Includes sender, receiver, and feedback topic.");
        feedback.setVariables(Arrays.asList(
            "recipientName", "companyService", "feedbackLink", "company"
        ));
        feedback.setAutoPopulatedVariables(config.get("feedback_request"));
        feedback.setPreview("Dear [recipientName],\nThank you for choosing [companyService]. Please give feedback: [feedbackLink]\nThe [company] Team");
        availableTemplates.put("feedback_request", feedback);

        // Freelancer Service Pitch Email
        TemplateInfo freelancer = new TemplateInfo();
        freelancer.setName("freelancer_service_pitch");
        freelancer.setDisplayName("Freelancer Service Pitch Email");
        freelancer.setDescription("Pitch your freelance services to potential clients. Includes sender, receiver, service, and a pitch message.");
        freelancer.setVariables(Arrays.asList(
            "clientName", "freelancerName", "serviceType", "clientBusiness", "problemGoal", "service1", "service2", "service3", "bookingLink"
        ));
        freelancer.setAutoPopulatedVariables(config.get("freelancer_service_pitch"));
        freelancer.setPreview("Hi [clientName], I'm [freelancerName] ([serviceType]). Let's connect! [bookingLink]");
        availableTemplates.put("freelancer_service_pitch", freelancer);

        // Tutoring/Coaching Offer Email
        TemplateInfo tutoring = new TemplateInfo();
        tutoring.setName("tutoring_coaching_offer");
        tutoring.setDisplayName("Tutoring/Coaching Offer Email");
        tutoring.setDescription("Reach out to students or parents with a tutoring/coaching offer. Includes sender, receiver, subject, and offer details.");
        tutoring.setVariables(Arrays.asList(
            "studentName", "tutorName", "subject", "topicGoal", "feature1", "feature2", "feature3", "bookingLink"
        ));
        tutoring.setAutoPopulatedVariables(config.get("tutoring_coaching_offer"));
        tutoring.setPreview("Dear [studentName], I'm [tutorName], tutoring in [subject]. [bookingLink]");
        availableTemplates.put("tutoring_coaching_offer", tutoring);

        // Local Product/Service Promo Email
        TemplateInfo localPromo = new TemplateInfo();
        localPromo.setName("local_product_service_promo");
        localPromo.setDisplayName("Local Product/Service Promo Email");
        localPromo.setDescription("Promote a local product or service to potential customers. Includes sender, receiver, product/service, and promo details.");
        localPromo.setVariables(Arrays.asList(
            "businessName", "customerName", "productService", "promoTitle", "promoDetails", "promoCode", "discount", "expiryDate", "shopLink"
        ));
        localPromo.setAutoPopulatedVariables(config.get("local_product_service_promo"));
        localPromo.setPreview("Hi [customerName], [promoTitle] at [businessName]. Use [promoCode] for [discount] off! [shopLink]");
        availableTemplates.put("local_product_service_promo", localPromo);
    }
    
    public List<TemplateInfo> getAllTemplates() {
        return new ArrayList<>(availableTemplates.values());
    }
    
    public TemplateInfo getTemplate(String templateName) {
        return availableTemplates.get(templateName);
    }
    
    public boolean templateExists(String templateName) {
        return availableTemplates.containsKey(templateName);
    }
    
    public static class TemplateInfo {
        private String name;
        private String displayName;
        private String description;
        private List<String> variables;
        private String preview;
        private Map<String, String> autoPopulatedVariables;
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public List<String> getVariables() { return variables; }
        public void setVariables(List<String> variables) { this.variables = variables; }
        
        public String getPreview() { return preview; }
        public void setPreview(String preview) { this.preview = preview; }
        
        public Map<String, String> getAutoPopulatedVariables() { return autoPopulatedVariables; }
        public void setAutoPopulatedVariables(Map<String, String> autoPopulatedVariables) { this.autoPopulatedVariables = autoPopulatedVariables; }
    }
} 