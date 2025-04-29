package com.example.fintrack.security.service;

import com.example.fintrack.security.enums.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final long REFRESH_EXPIRATION = 30L;

    public void saveToken(String email, String token, TokenType tokenType) {
        if (tokenType == TokenType.REFRESH) {
            System.out.printf("Adding refresh token to redis for email %s%n", email);
            redisTemplate.opsForValue().set(tokenType + "_" + email, token, REFRESH_EXPIRATION, TimeUnit.DAYS);
        }
    }

    public String getToken(String email, TokenType tokenType) {
        return (String) redisTemplate.opsForValue().get(tokenType + "_" + email);

    }
}