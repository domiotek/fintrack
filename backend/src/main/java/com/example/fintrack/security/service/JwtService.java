package com.example.fintrack.security.service;

import com.example.fintrack.security.enums.TokenType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.function.Function;

public interface JwtService {
    Claims extractAllClaims(String token, TokenType tokenType);
    Header<?> extractAllHeaders(String token, TokenType tokenType);
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver, TokenType tokenType);
    String extractEmail(String token, TokenType tokenType);
    Date extractExpiration(String token, TokenType tokenType);
    String generateToken(UserDetails userDetails, TokenType tokenType);
    boolean isTokenValid(String token, UserDetails userDetails);
    boolean isTokenExpired(String token, TokenType tokenType);
}
