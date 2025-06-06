package com.example.fintrack.user;

import com.example.fintrack.user.dto.PasswordDto;
import com.example.fintrack.user.dto.UpdateProfileDto;
import com.example.fintrack.user.dto.UserProfileDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/config")
    public ResponseEntity<UserProfileDto> getProfileInfo() {
        return ResponseEntity.ok().body(userService.getProfileInfo());
    }

    @PutMapping("/config")
    public ResponseEntity<Void> updateProfileInfo(@RequestBody UpdateProfileDto updateProfileDto) {
        userService.updateProfileInfo(updateProfileDto);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(@RequestBody @Valid PasswordDto passwordDto) {
        userService.updatePassword(passwordDto);

        return ResponseEntity.noContent().build();
    }
}
