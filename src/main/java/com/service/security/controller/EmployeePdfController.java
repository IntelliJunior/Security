package com.service.security.controller;

import com.service.security.model.Employee;
import com.service.security.service.EmployeePdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

// CORS is handled centrally by SecurityConfig.corsConfigurationSource()
// (localhost:5173 / localhost:8888) -- see the same note in
// EmployeeController for why the wildcard @CrossOrigin that used to be here
// was removed.
@RestController
@RequestMapping("/api/pdf")
@Tag(name = "PDF Generator", description = "API to generate Employee form")
public class EmployeePdfController {

    @Autowired
    private EmployeePdfService pdfService;

    @PostMapping("/employee")
    @Operation(summary = "Generate PDF API")
    public ResponseEntity<byte[]> generatePdf(@RequestBody Employee employee) {
        ByteArrayInputStream bis = pdfService.generateEmployeePdf(employee);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=" + sanitizeFileName(employee.getName()) + "_details.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(bis.readAllBytes());
    }

    // employee.getName() previously went straight into an HTTP header
    // unsanitized -- an unusual name (containing e.g. a quote, CR/LF, or
    // other control characters) could produce a malformed header. This
    // keeps only safe characters and falls back to a fixed name otherwise.
    private String sanitizeFileName(String name) {
        if (name == null || name.isBlank()) {
            return "employee";
        }
        String cleaned = name.trim().replaceAll("[^a-zA-Z0-9 _-]", "");
        return cleaned.isBlank() ? "employee" : cleaned;
    }
}
