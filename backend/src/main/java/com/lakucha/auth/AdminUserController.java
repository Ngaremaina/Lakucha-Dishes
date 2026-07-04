package com.lakucha.auth;

import com.lakucha.auth.dto.UserSummary;
import com.lakucha.common.PageResponse;
import com.lakucha.common.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public PageResponse<UserSummary> getAll(@PageableDefault(size = 20) Pageable pageable) {
        Page<UserSummary> page = userRepository.findAll(pageable).map(UserSummary::from);
        return PageResponse.from(page);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User " + id + " not found"));
        userRepository.delete(user);
    }
}
