package com.example.fintrack.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
public class UserService {
    private final Supplier<User> principalSupplier;

    public String test(){
        User user = principalSupplier.get();
        return user.getEmail();
    }
}
