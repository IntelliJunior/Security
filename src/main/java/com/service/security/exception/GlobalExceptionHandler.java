package com.service.security.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Centralized handling for validation failures so callers (the React app,
 * Swagger, or any future client) always get a JSON body with a clear
 * "message" and, where available, a per-field breakdown -- instead of
 * relying on Spring Boot's default error page, which by default omits the
 * exception message from the response body
 * (server.error.include-message=never unless configured).
 *
 * Scope is deliberately limited to validation-related exceptions plus the
 * existing ApiException. It does not add handling for anything that was
 * previously unhandled (e.g. the "Employee not found" RuntimeException in
 * EmployeeService still results in the same 500 response as before), so no
 * existing status codes change -- only the response body for validation
 * failures gains a readable message.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Thrown when @Valid fails on a @RequestBody / @RequestPart argument
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.putIfAbsent(fe.getField(), fe.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(buildBody("Validation failed", fieldErrors));
    }

    // Thrown for constraint violations outside @RequestBody (e.g. validated
    // path/query parameters), should any be added in future.
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(v ->
                fieldErrors.putIfAbsent(v.getPropertyPath().toString(), v.getMessage()));
        return ResponseEntity.badRequest().body(buildBody("Validation failed", fieldErrors));
    }

    // Existing custom exception (e.g. "Username already taken", "Invalid
    // username/email or password") -- already @ResponseStatus(BAD_REQUEST);
    // this handler only guarantees the message is present in the JSON body.
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> handleApiException(ApiException ex) {
        return ResponseEntity.badRequest().body(buildBody(ex.getMessage(), null));
    }

    private Map<String, Object> buildBody(String message, Map<String, String> fieldErrors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("message", message);
        if (fieldErrors != null && !fieldErrors.isEmpty()) {
            body.put("errors", fieldErrors);
        }
        return body;
    }
}
