package com.example.fintrack.security.service;

import com.example.fintrack.security.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private static final long REFRESH_EXPIRATION = 30L;

    private final RedisTemplate<String, Object> redisTemplate;

    public void saveToken(String email, String token, TokenType tokenType) {
        if (tokenType == TokenType.REFRESH) {
            redisTemplate.opsForValue().set(tokenType + "_" + email, token, REFRESH_EXPIRATION, TimeUnit.DAYS);
        }
    }

    public String getToken(String email, TokenType tokenType) {
        return (String) redisTemplate.opsForValue().get(tokenType + "_" + email);
    }
}