package com.project.email_usingJava.Config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired private JwtUtil jwtUtil;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        boolean shouldNotFilter = path.startsWith("/api/auth/") || path.equals("/healthz");
        System.out.println("JwtFilter - Path: " + path + ", shouldNotFilter: " + shouldNotFilter);
        return shouldNotFilter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = null, username = null;

            System.out.println("JwtFilter - Auth header: " + authHeader);
            System.out.println("JwtFilter - Request URI: " + request.getRequestURI());

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                System.out.println("JwtFilter - Token: " + token.substring(0, Math.min(token.length(), 20)) + "...");
                username = jwtUtil.extractUsername(token);
                System.out.println("JwtFilter - Extracted username: " + username);
            } else {
                System.out.println("JwtFilter - No valid Authorization header found");
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Create authentication token with proper authorities
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            username, 
                            null, 
                            Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("USER"))
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("JwtFilter - Authentication set for user: " + username);
            } else if (username == null) {
                System.out.println("JwtFilter - No username extracted from token");
                // Don't block the request, let Spring Security handle it
            } else {
                System.out.println("JwtFilter - Authentication already exists for user: " + username);
            }
        } catch (Exception e) {
            // Log the exception but don't block the request
            System.err.println("JWT Filter error: " + e.getMessage());
            e.printStackTrace();
            // Don't block the request, let Spring Security handle it
        }

        chain.doFilter(request, response);
    }
}

