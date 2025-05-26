package com.example.fintrack.authentication;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = PasswordConstraintValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Password {

    String message() default "Password must meet requirements";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
