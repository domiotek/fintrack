package com.example.fintrack.authentication;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.passay.*;

public class PasswordConstraintValidator implements ConstraintValidator<Password, String> {

    @Override
    public void initialize(Password constraintAnnotation) {
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext constraintValidatorContext) {
        if (password == null) {
            return false;
        }

        PasswordValidator passwordValidator = new PasswordValidator(
                new LengthRule(8, 50),
                new CharacterRule(PolishCharacterData.UpperCase, 1),
                new CharacterRule(PolishCharacterData.LowerCase, 1),
                new CharacterRule(EnglishCharacterData.Digit, 1),
                new CharacterRule(EnglishCharacterData.Special, 1)
        );

        RuleResult ruleResult = passwordValidator.validate(new PasswordData(password));
        return ruleResult.isValid();
    }
}
