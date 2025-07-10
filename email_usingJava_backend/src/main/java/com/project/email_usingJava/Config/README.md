# Template Auto-Population Configuration

This directory contains the configuration for auto-populating template variables.

## How to Modify Auto-Population Settings

To change which variables are auto-populated for each template, edit the `TemplateAutoPopulateConfig.java` file.

### Current Configuration

The configuration maps template names to variable mappings:

```java
// Example: For internship_job_request template
Map<String, String> internshipConfig = new HashMap<>();
internshipConfig.put("recipientName", "subscriber.name");    // Auto-populate from subscriber name
internshipConfig.put("studentName", "user.fullName");        // Auto-populate from user's full name
internshipConfig.put("email", "user.email");                 // Auto-populate from user's email
internshipConfig.put("phone", "user.phone");                 // Auto-populate from user's phone
config.put("internship_job_request", internshipConfig);
```

### Available Data Sources

- `"subscriber.name"` - Subscriber's name
- `"subscriber.email"` - Subscriber's email  
- `"user.fullName"` - User's full name
- `"user.email"` - User's email
- `"user.phone"` - User's phone number

### How to Add/Remove Auto-Population

1. **Add auto-population for a variable:**
   ```java
   config.put("variableName", "data.source");
   ```

2. **Remove auto-population for a variable:**
   Simply don't include that variable in the configuration map.

3. **Change the data source:**
   ```java
   // Change from subscriber name to user name
   config.put("recipientName", "user.fullName");
   ```

### Example: Modifying Feedback Template

To make the feedback template auto-populate the company name from the user's profile:

```java
// In getAutoPopulateConfig() method
Map<String, String> feedbackConfig = new HashMap<>();
feedbackConfig.put("recipientName", "subscriber.name");
feedbackConfig.put("company", "user.fullName");  // Add this line
config.put("feedback_request", feedbackConfig);
```

### Template Names

- `"feedback_request"` - Feedback Request Email
- `"internship_job_request"` - Internship/Job Request Email  
- `"freelancer_service_pitch"` - Freelancer Service Pitch Email
- `"tutoring_coaching_offer"` - Tutoring/Coaching Offer Email
- `"local_product_service_promo"` - Local Product/Service Promo Email

After making changes, restart the backend server for the changes to take effect. 