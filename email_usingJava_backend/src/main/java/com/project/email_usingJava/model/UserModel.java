package com.project.email_usingJava.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String appPassword;

    // Default constructor
    public UserModel() {
    }

    // Constructor with all fields
    public UserModel(Long id, String username, String email, String password, String appPassword) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.appPassword = appPassword;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getAppPassword() {
        return appPassword;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAppPassword(String appPassword) {
        this.appPassword = appPassword;
    }
}

