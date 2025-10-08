package com.service.security.controller;

import com.service.security.model.Employee;
import com.service.security.service.EmployeePdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*")
public class EmployeePdfController {

    @Autowired
    private EmployeePdfService pdfService;

    @PostMapping("/employee")
    public ResponseEntity<byte[]> generatePdf(@RequestBody Employee employee) {
        ByteArrayInputStream bis = pdfService.generateEmployeePdf(employee);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=" + employee.getName() + "_details.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(bis.readAllBytes());
    }
}
