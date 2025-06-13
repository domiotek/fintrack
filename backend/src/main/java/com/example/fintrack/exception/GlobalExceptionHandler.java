package com.example.fintrack.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ExceptionResponse.class)
    public ResponseEntity<BusinessErrorCodes> handleException(ExceptionResponse exceptionResponse) {
        return ResponseEntity.status(exceptionResponse.getBusinessErrorCode().getHttpStatus())
                .body(exceptionResponse.getBusinessErrorCode());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<BusinessErrorCodes> handleException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(BusinessErrorCodes.BAD_CREDENTIALS);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<String> handleException(MissingServletRequestParameterException missingServletRequestParameterException) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(missingServletRequestParameterException.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationExceptions(MethodArgumentNotValidException methodArgumentNotValidException) {
        Map<String, List<String>> errors = new HashMap<>();
        for (ObjectError objectError : methodArgumentNotValidException.getBindingResult().getAllErrors()) {
            if (objectError instanceof FieldError fieldError) {
                errors.computeIfAbsent(fieldError.getField(), key -> new ArrayList<>())
                        .add(fieldError.getDefaultMessage());
            } else {
                errors.computeIfAbsent(objectError.getObjectName(), key -> new ArrayList<>())
                        .add(objectError.getDefaultMessage());
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Exception> handleException(Exception exception) {
        logger.error(exception.getMessage(), exception);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception);
    }
}
