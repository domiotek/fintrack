package com.example.fintrack.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ExceptionResponse.class)
    public ResponseEntity<BusinessErrorCodes> handleException(ExceptionResponse exceptionResponse) {
        return ResponseEntity
                .status(exceptionResponse.getBusinessErrorCode().getHttpStatus())
                .body(exceptionResponse.getBusinessErrorCode());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<BusinessErrorCodes> handleException() {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(BusinessErrorCodes.BAD_CREDENTIALS);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Exception> handleException(Exception exception) {
        logger.error(exception.getMessage(), exception);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exception);
    }
}
