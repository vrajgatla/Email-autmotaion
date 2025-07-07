package com.project.email_usingJava.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public String signup(UserModel user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            return "Username already taken!";
        }
        if (userRepo.existsByEmail(user.getEmail())) {
            return "Email already registered!";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return "User registered successfully!";
    }

    @Override
    public UserModel getUserByUsername(String username) {
        return userRepo.findByUsername(username).orElse(null);
    }
}

