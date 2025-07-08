package com.project.email_usingJava.service;

import com.project.email_usingJava.model.UserModel;

public interface UserService {
    String signup(UserModel user);
    UserModel getUserByUsername(String username);
}
