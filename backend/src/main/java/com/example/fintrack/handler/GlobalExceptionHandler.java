package com.example.fintrack.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.example.fintrack.handler.BusinessErrorCodes.BAD_CREDENTIALS;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ExceptionResponse.class)
    public ResponseEntity<BusinessErrorCodes> handleException(ExceptionResponse ex) {

        return ResponseEntity
                .status(ex.getBusinessErrorCode().getHttpStatus())
                .body(
                        ex.getBusinessErrorCode()
                );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<BusinessErrorCodes> handleException(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                        BAD_CREDENTIALS
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleException(Exception ex) {
        // log the exception
        ex.printStackTrace();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        new ExceptionResponse()
                );
    }
}
