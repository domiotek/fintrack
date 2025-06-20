package com.example.fintrack.authentication;

import com.example.fintrack.authentication.dto.LoginRequestDto;
import com.example.fintrack.authentication.dto.RegisterRequestDto;
import com.example.fintrack.authentication.dto.TokenDto;
import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.security.service.JwtService;
import com.example.fintrack.security.service.RedisService;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import io.jsonwebtoken.Header;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.example.fintrack.exception.BusinessErrorCodes.*;
import static com.example.fintrack.security.TokenType.ACCESS;
import static com.example.fintrack.security.TokenType.REFRESH;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RedisService redisService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final CurrencyRepository currencyRepository;
    private final HttpServletRequest httpServletRequest;
    private final CategoryRepository categoryRepository;

    public void register(RegisterRequestDto registerRequestDto) {
        if (userRepository.existsUserByEmail(registerRequestDto.email())) {
            throw USER_ALREADY_EXISTS.getError();
        }

        Currency currency = currencyRepository.findById(registerRequestDto.currencyId())
                .orElseThrow(CURRENCY_DOES_NOT_EXIST::getError);

        User user = User.builder()
                .email(registerRequestDto.email())
                .password(passwordEncoder.encode(registerRequestDto.password()))
                .firstName(registerRequestDto.firstName())
                .lastName(registerRequestDto.lastName())
                .currency(currency)
                .build();

        userRepository.save(user);

        Category category1 = new Category();
        category1.setName("Default");
        category1.setColor("#B1A8B3");
        category1.setUser(user);
        category1.setIsDefault(true);

        Category category2 = new Category();
        category2.setName("Event");
        category2.setColor("#666A63");
        category2.setUser(user);
        category2.setIsDefault(true);

        categoryRepository.saveAll(List.of(category1, category2));
    }

    @Transactional
    public TokenDto login(LoginRequestDto loginRequestDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.email(), loginRequestDto.password())
        );

        User user = userRepository.findUserByEmail(loginRequestDto.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateToken(user, ACCESS);
        String refreshToken = jwtService.generateToken(user, REFRESH);

        return TokenDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public TokenDto refresh(HttpServletRequest request) {
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

        return TokenDto.builder()
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
