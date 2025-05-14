package com.example.fintrack.exception;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.IOException;

@Getter
@AllArgsConstructor
@JsonSerialize(using = BusinessErrorCodes.ErrorSerializer.class)
public enum BusinessErrorCodes {

    NO_CODE(0, "No code", HttpStatus.NOT_IMPLEMENTED),
    INVALID_TOKEN(100, "Invalid token", HttpStatus.FORBIDDEN),
    ACCESS_TOKEN_EXPIRED(300, "Access token expired", HttpStatus.UNAUTHORIZED),
    VERIFICATION_TOKEN_EXPIRED(301, "Verification token expired", HttpStatus.UNAUTHORIZED),
    BAD_CREDENTIALS(302, "Login and / or password is incorrect", HttpStatus.UNAUTHORIZED),
    ALREADY_EXISTS(303, "User with this email already exists", HttpStatus.CONFLICT),
    INVALID_USER(304, "Wrong refresh token", HttpStatus.FORBIDDEN),
    CURRENCY_NOT_FOUND(305, "Currency not found", HttpStatus.NOT_FOUND),
    ;

    private final int code;
    private final String description;
    private final HttpStatus httpStatus;

    public ExceptionResponse getError() {
        return new ExceptionResponse(this);
    }

    public static class ErrorSerializer extends JsonSerializer<BusinessErrorCodes> {

        @Override
        public void serialize(BusinessErrorCodes value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeStartObject();
            gen.writeStringField("message", value.getDescription());
            gen.writeNumberField("code", value.getCode());
            gen.writeEndObject();
        }
    }
}
