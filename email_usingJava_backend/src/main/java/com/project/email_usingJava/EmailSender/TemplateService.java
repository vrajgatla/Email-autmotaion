package com.project.email_usingJava.EmailSender;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class TemplateService {
    
    private final Map<String, TemplateInfo> availableTemplates;
    
    public TemplateService() {
        availableTemplates = new HashMap<>();
        initializeTemplates();
    }
    
    private void initializeTemplates() {
        // Welcome template
        TemplateInfo welcome = new TemplateInfo();
        welcome.setName("welcome");
        welcome.setDisplayName("Welcome Email");
        welcome.setDescription("A warm welcome email for new users");
        welcome.setVariables(Arrays.asList("name", "company", "website"));
        welcome.setPreview("Hi [name], welcome to [company]! We're thrilled to have you here.");
        availableTemplates.put("welcome", welcome);
        
        // Good Morning template
        TemplateInfo goodMorning = new TemplateInfo();
        goodMorning.setName("goodmorning");
        goodMorning.setDisplayName("Good Morning Email");
        goodMorning.setDescription("A cheerful morning greeting email");
        goodMorning.setVariables(Arrays.asList("name", "date", "weather"));
        goodMorning.setPreview("Good morning [name]! Wishing you a productive day ahead.");
        availableTemplates.put("goodmorning", goodMorning);
        
        // Thank You template
        TemplateInfo thankYou = new TemplateInfo();
        thankYou.setName("thankyou");
        thankYou.setDisplayName("Thank You Email");
        thankYou.setDescription("A gratitude email for loyal customers");
        thankYou.setVariables(Arrays.asList("name", "service", "feedback"));
        thankYou.setPreview("Hello [name], thank you for choosing [service]. Your support means a lot!");
        availableTemplates.put("thankyou", thankYou);
        
        // Newsletter template
        TemplateInfo newsletter = new TemplateInfo();
        newsletter.setName("newsletter");
        newsletter.setDisplayName("Newsletter Email");
        newsletter.setDescription("A comprehensive monthly newsletter with highlights and updates");
        newsletter.setVariables(Arrays.asList("name", "company", "date", "highlight1", "highlight2", "highlight3", "newsContent", "proTip", "website", "unsubscribeLink"));
        newsletter.setPreview("Hello [name]! Here's your monthly newsletter from [company] with the latest updates and insights.");
        availableTemplates.put("newsletter", newsletter);
        
        // Promotion template
        TemplateInfo promotion = new TemplateInfo();
        promotion.setName("promotion");
        promotion.setDisplayName("Promotion Email");
        promotion.setDescription("An attractive promotional email for special offers and discounts");
        promotion.setVariables(Arrays.asList("name", "company", "discountPercent", "offerDescription", "promoCode", "feature1", "feature2", "feature3", "ctaLink", "expiryDate", "supportEmail"));
        promotion.setPreview("Hello [name]! Don't miss our special [discountPercent]% off offer on [offerDescription]!");
        availableTemplates.put("promotion", promotion);
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
    }
} 