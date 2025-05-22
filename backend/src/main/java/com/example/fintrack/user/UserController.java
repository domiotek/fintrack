package com.example.fintrack.user;

import com.example.fintrack.user.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/test")
    public ResponseEntity<String> register() {
        return ResponseEntity.ok().body(userService.test());
    }

    @GetMapping("/config")
    public ResponseEntity<UserProfileDto> profile() {
        return ResponseEntity.ok().body(userService.profile());
    }
}
