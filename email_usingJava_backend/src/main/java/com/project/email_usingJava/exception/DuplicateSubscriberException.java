package com.project.email_usingJava.exception;

public class DuplicateSubscriberException extends RuntimeException {
    public DuplicateSubscriberException(String message) {
        super(message);
    }
} 