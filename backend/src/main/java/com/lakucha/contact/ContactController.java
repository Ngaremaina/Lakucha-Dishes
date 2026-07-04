package com.lakucha.contact;

import com.lakucha.common.PageResponse;
import com.lakucha.common.ResourceNotFoundException;
import com.lakucha.contact.dto.ContactRequest;
import com.lakucha.contact.dto.ContactResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse submit(@Valid @RequestBody ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.name())
                .email(request.email())
                .message(request.message())
                .build();
        return ContactResponse.from(contactRepository.save(contact));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<ContactResponse> getAll(@PageableDefault(size = 20) Pageable pageable) {
        Page<ContactResponse> page = contactRepository.findAll(pageable).map(ContactResponse::from);
        return PageResponse.from(page);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message " + id + " not found"));
        contactRepository.delete(contact);
    }
}
