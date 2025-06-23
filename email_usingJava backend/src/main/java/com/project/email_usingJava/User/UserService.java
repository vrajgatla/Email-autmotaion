package com.project.email_usingJava.User;



public interface UserService {
    String signup(UserModel user);
    UserModel getUserByUsername(String username);
}
