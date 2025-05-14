package com.example.fintrack.auth.service;

import com.example.fintrack.auth.api.LoginRequest;
import com.example.fintrack.auth.api.RegisterRequest;
import com.example.fintrack.auth.api.Token;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.security.service.JwtService;
import com.example.fintrack.security.service.RedisService;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import io.jsonwebtoken.Header;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.example.fintrack.exception.BusinessErrorCodes.*;
import static com.example.fintrack.security.enums.TokenType.ACCESS;
import static com.example.fintrack.security.enums.TokenType.REFRESH;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RedisService redisService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final CurrencyRepository currencyRepository;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ALREADY_EXISTS.getError();
        }

        Optional<Currency> defaultCurrency = currencyRepository.findByName("PLN");

        if (defaultCurrency.isEmpty()) {
            throw CURRENCY_NOT_FOUND.getError();
        }

        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .currency(defaultCurrency.get())
                .build();

        userRepository.save(user);
    }

    @Override
    @Transactional
    public Token login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var accessToken = jwtService.generateToken(user, ACCESS);
        var refreshToken = jwtService.generateToken(user, REFRESH);

        return Token.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken).build();
    }

    @Override
    public Token refresh(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();

        if (isNull(cookies)) {
            throw INVALID_USER.getError();
        }

        String refreshToken = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("refresh_token"))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (refreshToken == null) {
            throw INVALID_USER.getError();
        }

        String email = jwtService.extractEmail(refreshToken, REFRESH);

        String storedToken = redisService.getToken(email, REFRESH);

        if (!Objects.equals(storedToken, refreshToken)) {
            throw INVALID_USER.getError();
        }

        Header<?> storedTokenHeaders = jwtService.extractAllHeaders(storedToken, REFRESH);

        Map<String, String> newHeaders = new HashMap<>();
        newHeaders.put("source", getHeader("source"));
        newHeaders.put("user-agent", getHeader("user-agent"));
        newHeaders.put("origin", getHeader("origin"));

        if (!compareHeaders(storedTokenHeaders, newHeaders)) {
            throw INVALID_USER.getError();
        }

        UserDetails user = this.userDetailsService.loadUserByUsername(email);

        String newAccessToken = jwtService.generateToken(user, ACCESS);

        return Token.builder()
                .accessToken(newAccessToken)
                .build();
    }

    private boolean compareHeaders(Header<?> headers, Map<String, String> newHeaders) {
        for (Map.Entry<String, String> entry : newHeaders.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (isNull(value)) continue;
            if (!headers.containsKey(key) || !headers.get(key).equals(value)) {
                return false;
            }
        }
        return true;
    }

    private String getHeader(String headerName) {
        return httpServletRequest.getHeader(headerName);
    }
}
