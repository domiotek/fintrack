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
    USER_ALREADY_EXISTS(303, "User with this email already exists", HttpStatus.CONFLICT),
    INVALID_USER(304, "Wrong refresh token", HttpStatus.FORBIDDEN),
    INTERNAL_SERVER_ERROR(305, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_ALREADY_PAID(306, "User already paid", HttpStatus.CONFLICT),
    USER_IS_FOUNDER(307, "User is a founder", HttpStatus.CONFLICT),
    EVENT_ALREADY_CONTAINS_USER(308, "Event already contains user", HttpStatus.CONFLICT),
    CURRENCY_DOES_NOT_EXIST(401, "Currency does not exist", HttpStatus.NOT_FOUND),
    EVENT_DOES_NOT_EXIST(402, "Event does not exist", HttpStatus.NOT_FOUND),
    USER_DOES_NOT_EXIST(403, "User does not exist", HttpStatus.NOT_FOUND),
    CATEGORY_DOES_NOT_EXIST(404, "Category does not exist", HttpStatus.NOT_FOUND),
    BILL_DOES_NOT_EXIST(405, "Bill does not exist", HttpStatus.NOT_FOUND),
    MISSING_REQUEST_BODY(501, "Missing request body", HttpStatus.FAILED_DEPENDENCY),
    LIMIT_DOES_NOT_EXIST(406, "Limit does not exist", HttpStatus.NOT_FOUND),
    REQUEST_FAILED(502, "Request failed", HttpStatus.BAD_GATEWAY);

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
