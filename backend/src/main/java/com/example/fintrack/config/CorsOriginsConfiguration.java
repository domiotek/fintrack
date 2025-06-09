package com.example.fintrack.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsOriginsConfiguration {

    @Value("${SPRING_ALLOWED_ORIGINS:http://localhost:4200,http://localhost}")
    private String corsAllowedOrigins;

    @Bean
    public List<String> corsAllowedOriginsPatterns() {
        String[] origins = corsAllowedOrigins.split(",");

        List<String> originPatterns = Arrays.stream(origins)
                .map(origin -> {
                    if (origin.startsWith("http://")) {
                        String domain = origin.substring(7);
                        return "http://*." + domain;
                    } else if (origin.startsWith("https://")) {
                        String domain = origin.substring(8);
                        return "https://*." + domain;
                    } else {
                        return origin;
                    }
                })
                .collect(Collectors.toList());

        originPatterns.addAll(List.of(origins));

        return originPatterns;
    }
}
