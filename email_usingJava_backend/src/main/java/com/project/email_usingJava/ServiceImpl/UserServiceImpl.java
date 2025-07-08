package com.project.email_usingJava.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.project.email_usingJava.repository.UserRepository;
import com.project.email_usingJava.service.UserService;
import com.project.email_usingJava.model.UserModel;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String signup(UserModel user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already taken!";
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already registered!";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    @Override
    public UserModel getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}

