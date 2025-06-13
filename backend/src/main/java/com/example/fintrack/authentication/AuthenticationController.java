package com.example.fintrack.authentication;

import com.example.fintrack.authentication.dto.LoginRequestDto;
import com.example.fintrack.authentication.dto.RegisterRequestDto;
import com.example.fintrack.authentication.dto.TokenDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {    
	private final AuthenticationService authenticationService;

    @Value("${SPRING_DOMAIN:localhost}")
    private String domain;

    @Value("${SPRING_SECURE_COOKIES:false}")
    private String secureCookies;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequestDto registerRequestDto) {
        authenticationService.register(registerRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody @Valid LoginRequestDto loginRequestDto, HttpServletResponse response) {
        TokenDto tokens = authenticationService.login(loginRequestDto);

        ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", tokens.accessToken())
                .httpOnly(true)
                .secure(secureCookies.equals("true"))
                .path("/")
                .maxAge(24 * 60 * 60) // 24h
                .domain(domain)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", tokens.refreshToken())
                .httpOnly(true)
                .secure(secureCookies.equals("true"))
                .path("/")
                .maxAge(30 * 24 * 60 * 60) // 30d
                .domain(domain)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest request, HttpServletResponse response) {
        TokenDto tokens = authenticationService.refresh(request);

        ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", tokens.accessToken())
                .httpOnly(true)
                .secure(secureCookies.equals("true"))
                .path("/")
                .maxAge(24 * 60 * 60) // 24h
                .domain(domain)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(secureCookies.equals("true"))
                .path("/")
                .maxAge(0)
                .domain(domain)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(secureCookies.equals("true"))
                .path("/")
                .maxAge(0)
                .domain(domain)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        return ResponseEntity.ok().build();
    }
}
