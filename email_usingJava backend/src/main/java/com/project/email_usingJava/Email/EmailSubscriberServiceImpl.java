package com.project.email_usingJava.Email;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
	public class EmailSubscriberServiceImpl implements EmailSubscriberService {

	    @Autowired
	    private EmailSubscriberRepository repository;

	    @Override
	    public EmailSubscriber save(EmailSubscriber subscriber) {
	        return repository.save(subscriber);
	    }

	    @Override
	    public List<EmailSubscriber> getAll() {
	        return repository.findAll();
	    }

	    @Override
	    public EmailSubscriber update(Long id, EmailSubscriber subscriber) {
	        EmailSubscriber existing = repository.findById(id).orElseThrow();
	        existing.setEmail(subscriber.getEmail());
	        existing.setName(subscriber.getName());
	        return repository.save(existing);
	    }

	    @Override
	    public void delete(Long id) {
	        repository.deleteById(id);
	    }
	}



