package com.example.backend.serviceImpI.passwordvalidator;

import java.util.regex.Pattern;

public class PasswordValidator {


    private static final String PASSWORD_PATTERN =
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    public static boolean isStrongPassword(String password) {
        if (password == null) return false;
        return pattern.matcher(password).matches();
    }
}