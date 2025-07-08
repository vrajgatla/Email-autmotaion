package com.project.email_usingJava.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:5173", // local dev
<<<<<<< HEAD
            "https://full-stack-email-autmotaion.vercel.app/" // <-- replace with your real production domain

=======
            "https://fullstack-email-autmotaion-a02x.onrender.com" // <-- replace with your real production domain
>>>>>>> 442518a6b2ca735a87f0cd1c74c0c84c5c84d3ce
        ));
        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

