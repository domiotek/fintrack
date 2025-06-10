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
    CATEGORY_ALREADY_EXISTS(309, "Category already exists", HttpStatus.CONFLICT),
    INVALID_PASSWORD(310, "Invalid password", HttpStatus.UNAUTHORIZED),
    CURRENCY_DOES_NOT_EXIST(401, "Currency does not exist", HttpStatus.NOT_FOUND),
    EVENT_DOES_NOT_EXIST(402, "Event does not exist", HttpStatus.NOT_FOUND),
    USER_DOES_NOT_EXIST(403, "User does not exist", HttpStatus.NOT_FOUND),
    CATEGORY_DOES_NOT_EXIST(404, "Category does not exist", HttpStatus.NOT_FOUND),
    BILL_DOES_NOT_EXIST(405, "Bill does not exist", HttpStatus.NOT_FOUND),
    LIMIT_DOES_NOT_EXIST(406, "Limit does not exist", HttpStatus.NOT_FOUND),
    RATE_DOES_NOT_EXIST(407, "Rate does not exist", HttpStatus.NOT_FOUND),
    FRIEND_DOES_NOT_EXIST(408, "Friend does not exist", HttpStatus.NOT_FOUND),
    MESSAGE_DOES_NOT_EXIST(409, "Message does not exist", HttpStatus.NOT_FOUND),
    LAST_READ_MESSAGE_DOES_NOT_EXIST(410, "Last read message does not exist", HttpStatus.NOT_FOUND),
    CHAT_DOES_NOT_EXIST(411, "Chat does not exist", HttpStatus.NOT_FOUND),
    INVALID_MESSAGE_ID(412, "Invalid message id", HttpStatus.NOT_FOUND),
    MISSING_REQUEST_BODY(501, "Missing request body", HttpStatus.FAILED_DEPENDENCY),
    REQUEST_FAILED(502, "Request failed", HttpStatus.BAD_GATEWAY),
    CANNOT_INVITE_YOURSELF(601, "Cannot invite yourself", HttpStatus.CONFLICT),
    ALREADY_FRIENDS(602, "Users are already friends", HttpStatus.CONFLICT),
    CANNOT_DELETE_DEFAULT_CATEGORY(603, "Cannot delete default category", HttpStatus.CONFLICT);

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
