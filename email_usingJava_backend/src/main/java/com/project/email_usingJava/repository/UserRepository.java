package com.project.email_usingJava.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.email_usingJava.model.UserModel;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
	Optional<UserModel> findByEmail(String email);
}

