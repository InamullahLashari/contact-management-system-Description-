package com.example.backend.serviceImpI.passwordvalidator;

import java.util.regex.Pattern;

public class PasswordValidator {

    // Minimum 8 chars, at least 1 upper, 1 lower, 1 digit, 1 special char
    private static final String PASSWORD_PATTERN =
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    public static boolean isStrongPassword(String password) {
        if (password == null) return false;
        return pattern.matcher(password).matches();
    }
}