package com.example.Backend.exception;

public class RecordExistException extends RuntimeException {
    public RecordExistException(String message) {
        super(message);
    }
}