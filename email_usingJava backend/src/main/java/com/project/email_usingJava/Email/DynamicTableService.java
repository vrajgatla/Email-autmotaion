package com.project.email_usingJava.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class DynamicTableService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PostConstruct
    public void init() {
        // Create the main user_subscribers table if it doesn't exist
        createMainTable();
    }
    
    private void createMainTable() {
        String createTableSQL = """
            CREATE TABLE IF NOT EXISTS user_subscribers (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                INDEX idx_username (username),
                INDEX idx_email (email)
            )
        """;
        
        try {
            jdbcTemplate.execute(createTableSQL);
            System.out.println("Main user_subscribers table created/verified successfully");
        } catch (Exception e) {
            System.err.println("Error creating main table: " + e.getMessage());
        }
    }
    
    public void createUserSubscriberTable(String username) {
        String tableName = "subscribers_" + username.replaceAll("[^a-zA-Z0-9_]", "_");
        
        String createTableSQL = """
            CREATE TABLE IF NOT EXISTS %s (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """.formatted(tableName);
        
        try {
            jdbcTemplate.execute(createTableSQL);
            System.out.println("User subscriber table created: " + tableName);
        } catch (Exception e) {
            System.err.println("Error creating user table: " + e.getMessage());
        }
    }
    
    public String getUserTableName(String username) {
        return "subscribers_" + username.replaceAll("[^a-zA-Z0-9_]", "_");
    }
} 