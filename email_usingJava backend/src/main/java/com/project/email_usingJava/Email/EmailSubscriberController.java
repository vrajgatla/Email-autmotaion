package com.project.email_usingJava.Email;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscribers")
@CrossOrigin("*")
public class EmailSubscriberController {

    @Autowired
    private EmailSubscriberService service;

    @PostMapping
    public EmailSubscriber add(@RequestBody EmailSubscriber subscriber) {
        return service.save(subscriber);
    }

    @GetMapping
    public List<EmailSubscriber> list() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public EmailSubscriber update(@PathVariable Long id, @RequestBody EmailSubscriber subscriber) {
        return service.update(id, subscriber);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

