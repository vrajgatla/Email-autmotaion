package com.project.email_usingJava;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {
    @GetMapping("/healthz")
    public String healthCheck() {
        return "OK";
    }
} 