package com.project.email_usingJava.Email;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailSubscriberRepository extends JpaRepository<EmailSubscriber, Long> {
    boolean existsByEmail(String email);
}
