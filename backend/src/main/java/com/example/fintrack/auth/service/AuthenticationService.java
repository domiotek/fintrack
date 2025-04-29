package com.example.fintrack.auth.service;

import com.example.fintrack.auth.api.LoginRequest;
import com.example.fintrack.auth.api.RegisterRequest;
import com.example.fintrack.auth.api.Token;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {
    void register(RegisterRequest request);
    Token login(LoginRequest request);
    Token refresh(HttpServletRequest request, HttpServletResponse response);
}
