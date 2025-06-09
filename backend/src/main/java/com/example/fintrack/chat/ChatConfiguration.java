package com.example.fintrack.chat;

import com.example.fintrack.security.JwtHandshakeInterceptor;
import com.example.fintrack.security.service.CustomHandshakeHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class ChatConfiguration implements WebSocketMessageBrokerConfigurer {

    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final CustomHandshakeHandler customHandshakeHandler;

    @Value("${SPRING_ALLOWED_ORIGINS:http://localhost:4200,http://localhost}")
    private String allowedOrigins;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        String[] origins = allowedOrigins.split(",");
        List<String> originPatterns = Arrays.stream(origins)
                .map(origin -> {
                    if (origin.startsWith("http://")) {
                        String domain = origin.substring(7);
                        return "http://*." + domain;
                    } else if (origin.startsWith("https://")) {
                        String domain = origin.substring(8);
                        return "https://*." + domain;
                    }
                    return origin;
                })
                .collect(Collectors.toList());

        originPatterns.addAll(Arrays.asList(origins));

        registry.addEndpoint("/ws/chats")
                .setHandshakeHandler(customHandshakeHandler)
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOriginPatterns(originPatterns.toArray(new String[0]))
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
        registry.setUserDestinationPrefix("/user");
    }
}
