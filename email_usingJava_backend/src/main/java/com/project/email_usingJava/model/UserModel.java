package com.project.email_usingJava.model;

import com.project.email_usingJava.util.AppPasswordUtil;
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
    private String appPassword; // Encrypted

    @Column(nullable = true)
    private String appPasswordHash; // Hashed

    @Column(length = 255)
    private String fullName;

    @Column(length = 20)
    private String dob;

    @Column(length = 10)
    private String gender;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String address;

    @Lob
    private byte[] avatar;

    @Column(nullable = false)
    private int sentEmails = 0;

    // Default constructor
    public UserModel() {
    }

    // Constructor with all fields
    public UserModel(Long id, String username, String email, String password, String appPassword) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.appPassword = AppPasswordUtil.encrypt(appPassword);
        this.appPasswordHash = AppPasswordUtil.hash(appPassword);
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

    public String getDecryptedAppPassword() {
        return AppPasswordUtil.decrypt(this.appPassword);
    }

    public String getAppPasswordHash() {
        return appPasswordHash;
    }

    public boolean isAppPasswordMatch(String rawPassword) {
        return AppPasswordUtil.matches(rawPassword, this.appPasswordHash);
    }

    public String getFullName() {
        return fullName;
    }

    public String getDob() {
        return dob;
    }

    public String getGender() {
        return gender;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public byte[] getAvatar() {
        return avatar;
    }

    public int getSentEmails() {
        return sentEmails;
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
        this.appPassword = AppPasswordUtil.encrypt(appPassword);
        this.appPasswordHash = AppPasswordUtil.hash(appPassword);
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setAvatar(byte[] avatar) {
        this.avatar = avatar;
    }

    public void setSentEmails(int sentEmails) {
        this.sentEmails = sentEmails;
    }
}

