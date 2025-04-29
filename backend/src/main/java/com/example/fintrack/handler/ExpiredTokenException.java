package com.example.fintrack.handler;

import io.jsonwebtoken.Claims;
import lombok.Getter;

@Getter
public class ExpiredTokenException extends RuntimeException {
    private final Claims claims;

    public ExpiredTokenException(String message, Claims claims) {
        super(message);
        this.claims = claims;
    }
}
