package com.project.email_usingJava.exception;

public class NoSubscribersException extends RuntimeException {
    public NoSubscribersException(String message) {
        super(message);
    }
} 