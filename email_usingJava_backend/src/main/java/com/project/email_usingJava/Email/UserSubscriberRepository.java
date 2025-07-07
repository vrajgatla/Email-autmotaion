package com.project.email_usingJava.Email;

import com.project.email_usingJava.Email.DynamicTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class UserSubscriberRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private DynamicTableService dynamicTableService;
    
    public List<Map<String, Object>> findByUsername(String username) {
        String tableName = dynamicTableService.getUserTableName(username);
        String sql = "SELECT * FROM " + tableName;
        
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            System.err.println("Error fetching subscribers for user " + username + ": " + e.getMessage());
            return List.of();
        }
    }
    
    public void save(String username, String email, String name) {
        String tableName = dynamicTableService.getUserTableName(username);
        String sql = "INSERT INTO " + tableName + " (email, name) VALUES (?, ?)";
        
        try {
            jdbcTemplate.update(sql, email, name);
            System.out.println("Subscriber saved for user: " + username);
        } catch (Exception e) {
            System.err.println("Error saving subscriber for user " + username + ": " + e.getMessage());
            throw e;
        }
    }
    
    public void update(String username, Long id, String email, String name) {
        String tableName = dynamicTableService.getUserTableName(username);
        String sql = "UPDATE " + tableName + " SET email = ?, name = ? WHERE id = ?";
        
        try {
            jdbcTemplate.update(sql, email, name, id);
        } catch (Exception e) {
            System.err.println("Error updating subscriber for user " + username + ": " + e.getMessage());
            throw e;
        }
    }
    
    public void delete(String username, Long id) {
        String tableName = dynamicTableService.getUserTableName(username);
        String sql = "DELETE FROM " + tableName + " WHERE id = ?";
        
        try {
            jdbcTemplate.update(sql, id);
        } catch (Exception e) {
            System.err.println("Error deleting subscriber for user " + username + ": " + e.getMessage());
            throw e;
        }
    }
    
    public void createUserTable(String username) {
        dynamicTableService.createUserSubscriberTable(username);
    }
    
    public boolean emailExists(String username, String email) {
        String tableName = dynamicTableService.getUserTableName(username);
        String sql = "SELECT COUNT(*) FROM " + tableName + " WHERE LOWER(email) = LOWER(?)";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
            return count != null && count > 0;
        } catch (Exception e) {
            System.err.println("Error checking if email exists for user " + username + ": " + e.getMessage());
            return false;
        }
    }
} 