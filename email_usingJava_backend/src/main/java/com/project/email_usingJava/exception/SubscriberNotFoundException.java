package com.project.email_usingJava.exception;

public class SubscriberNotFoundException extends RuntimeException {
    public SubscriberNotFoundException(String message) {
        super(message);
    }
} 