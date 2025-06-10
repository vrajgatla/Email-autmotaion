package com.project.email_usingJava.Email;

import java.util.List;

public interface EmailSubscriberService {
	    EmailSubscriber save(EmailSubscriber subscriber);
	    List<EmailSubscriber> getAll();
	    EmailSubscriber update(Long id, EmailSubscriber subscriber);
	    void delete(Long id);
	}


