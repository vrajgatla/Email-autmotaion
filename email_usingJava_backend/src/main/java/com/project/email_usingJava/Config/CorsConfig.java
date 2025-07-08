package com.project.email_usingJava.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.Arrays;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String allowedOriginEnv = System.getenv("CORS_ORIGIN");
                String[] allowedOrigins;
                if (allowedOriginEnv != null && !allowedOriginEnv.isEmpty()) {
                    allowedOrigins = Arrays.stream(allowedOriginEnv.split(","))
                        .map(String::trim)
                        .filter(origin -> !origin.equals("*"))
                        .toArray(String[]::new);
                } else {
                    allowedOrigins = new String[]{"https://full-stack-email-autmotaion.vercel.app", "http://localhost:5173"};
                }
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

