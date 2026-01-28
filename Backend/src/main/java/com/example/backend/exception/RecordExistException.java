package com.example.backend.exception;

public class RecordExistException extends RuntimeException {
    public RecordExistException(String message) {
        super(message);
    }
}