package com.example.Backend.exception;

public class PasswordReuseException extends RuntimeException {


    public PasswordReuseException(String message) {
        super(message);

    }
}