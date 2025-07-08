package com.project.email_usingJava.Config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    // Use a fixed secret key instead of generating a new one each time
    private final String SECRET_STRING = "your-super-secret-jwt-key-that-should-be-very-long-and-secure-123456789";
    private final Key secret = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());
    private final long expiration = 5 * 60 * 60 * 1000; // 5 hours

    public String generateToken(String username) {
        try {
            System.out.println("Generating JWT token for username: " + username);
            String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secret)
                .compact();
            System.out.println("JWT token generated successfully");
            return token;
        } catch (Exception e) {
            System.err.println("Error generating JWT token: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String extractUsername(String token) {
        try {
            System.out.println("Extracting username from JWT token");
            String username = Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
            System.out.println("Username extracted successfully: " + username);
            return username;
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token has expired: " + e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            System.err.println("Unsupported JWT token: " + e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            System.err.println("Malformed JWT token: " + e.getMessage());
            throw e;
        } catch (SecurityException e) {
            System.err.println("JWT signature validation failed: " + e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            System.err.println("JWT token is empty or null: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error extracting username from JWT: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public boolean validateToken(String token) {
        try {
            System.out.println("Validating JWT token");
            Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token);
            System.out.println("JWT token is valid");
            return true;
        } catch (Exception e) {
            System.err.println("JWT token validation failed: " + e.getMessage());
            return false;
        }
    }
}
