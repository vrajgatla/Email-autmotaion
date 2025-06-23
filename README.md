# Email Automation System

A full-stack email automation system with dynamic template support, built with Spring Boot (Java) and React.

## Features

### 🔧 Core Features
- **User Authentication & Authorization** - JWT-based secure authentication
- **Email Sending** - Support for simple emails, attachments, and dynamic templates
- **Subscriber Management** - Add and manage email subscribers
- **Template System** - Dynamic HTML email templates with variable substitution

### 📧 Email Types
1. **Simple Email** - Basic text emails
2. **Email with Attachments** - Send files along with emails
3. **Template Email** - Dynamic HTML templates with variable substitution

### 🎨 Dynamic Templates
The system includes several pre-built templates:

#### 1. Welcome Email
- **Variables**: `name`, `company`, `website`
- **Purpose**: Welcome new users to your platform
- **Features**: Professional design with company branding

#### 2. Good Morning Email
- **Variables**: `name`, `date`, `weather`
- **Purpose**: Daily morning greetings
- **Features**: Cheerful design with weather integration

#### 3. Thank You Email
- **Variables**: `name`, `service`, `feedback`
- **Purpose**: Express gratitude to customers
- **Features**: Professional thank you message

#### 4. Newsletter Email
- **Variables**: `name`, `company`, `date`, `highlight1`, `highlight2`, `highlight3`, `newsContent`, `proTip`, `website`, `unsubscribeLink`
- **Purpose**: Monthly newsletters with highlights and updates
- **Features**: Comprehensive layout with multiple sections

#### 5. Promotion Email
- **Variables**: `name`, `company`, `discountPercent`, `offerDescription`, `promoCode`, `feature1`, `feature2`, `feature3`, `ctaLink`, `expiryDate`, `supportEmail`
- **Purpose**: Marketing campaigns and special offers
- **Features**: Attractive design with call-to-action buttons

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Gmail account with App Password

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd "email_usingJava backend"
   ```

2. Configure database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/email_automation
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd "email-automation frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the 16-character app password in the application

### Template Customization
Templates are located in `email_usingJava backend/src/main/resources/templates/`:
- `welcome.html` - Welcome email template
- `goodmorning.html` - Morning greeting template
- `thankyou.html` - Thank you email template
- `newsletter.html` - Newsletter template
- `promotion.html` - Promotion email template

## 📖 Usage

### 1. User Registration & Login
- Register with your email and Gmail app password
- Login to access the email dashboard

### 2. Adding Subscribers
- Navigate to the Subscribers page
- Add email addresses of your subscribers
- Manage your subscriber list

### 3. Sending Emails

#### Simple Email
1. Select "Simple Email" type
2. Enter recipient email (or choose "Send to All")
3. Add subject and message
4. Click "Send Email"

#### Email with Attachments
1. Select "Email with Attachment" type
2. Fill in recipient, subject, and message
3. Choose files to attach
4. Click "Send Email"

#### Template Email
1. Select "Template Email" type
2. Choose a template from the dropdown
3. Fill in the required variables
4. Preview the email (optional)
5. Click "Send Email"

### 4. Template Variables
Each template has specific variables that need to be filled:

#### Welcome Template
- `name` - Recipient's name
- `company` - Your company name
- `website` - Your website URL

#### Newsletter Template
- `name` - Recipient's name
- `company` - Your company name
- `date` - Newsletter date
- `highlight1`, `highlight2`, `highlight3` - Main highlights
- `newsContent` - Main news content
- `proTip` - Pro tip for users
- `website` - Your website URL
- `unsubscribeLink` - Unsubscribe link

#### Promotion Template
- `name` - Recipient's name
- `company` - Your company name
- `discountPercent` - Discount percentage
- `offerDescription` - Description of the offer
- `promoCode` - Promotional code
- `feature1`, `feature2`, `feature3` - Key features
- `ctaLink` - Call-to-action link
- `expiryDate` - Offer expiry date
- `supportEmail` - Support email address

## 🛠️ Technical Details

### Backend Architecture
- **Spring Boot 3.5.0** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **Thymeleaf** - Template engine for email processing
- **Jakarta Mail** - Email sending functionality
- **JWT** - Token-based authentication

### Frontend Architecture
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Database Schema
- **users** - User accounts and Gmail credentials
- **subscribers** - Email subscriber list
- **email_logs** - Email sending history

## 🔒 Security Features
- JWT-based authentication
- Password encryption
- CORS configuration
- Input validation
- SQL injection prevention

## 📧 Email Features
- HTML email support
- Variable substitution
- Attachment support
- Bulk email sending
- Template preview
- Error handling

## 🎯 Future Enhancements
- Email scheduling
- Email analytics
- Template editor
- A/B testing
- Email tracking
- Advanced segmentation
- API rate limiting
- Email templates marketplace

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

## 🆘 Support
For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Note**: Make sure to configure your Gmail app password correctly and test the email functionality before using in production.