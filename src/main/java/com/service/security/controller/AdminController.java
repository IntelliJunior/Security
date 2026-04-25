package com.service.security.controller;

import com.service.security.model.Employee;
import com.service.security.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "The API controlled by Admin to Register,Update,Get and Delete Employee")
public class AdminController {

    private final EmployeeService employeeService;

    public AdminController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Register employee
    @PostMapping("/employees/register")
    @Operation(summary = "Register a Employee")
    public ResponseEntity<?> registerEmployee(
            @RequestPart("employee") Employee employee,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {

        try {
            Employee saved = employeeService.saveEmployee(employee, photo);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // List all employees (descending by registration date)
    @GetMapping("/employees")
    @Operation(summary = "Fetch all Employee")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> list = employeeService.getAllEmployeesDesc();
        return ResponseEntity.ok(list);
    }

    // Get employee by ID (for pre-filling edit form)
    @GetMapping("/employees/{id}")
    @Operation(summary = "Fetch a Employee by ID")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee emp = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(emp);
    }

    // Update employee
    @PutMapping("/employees/{id}")
    @Operation(summary = "Update a Employee")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        Employee updated = employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok(updated);
    }

    // Delete employee
    @DeleteMapping("/employees/{id}")
    @Operation(summary = "Delete a Employee")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Employee deleted successfully");
    }

    // Test secure endpoint
    @GetMapping("/secure")
    public String secure() {
        return "Welcome to Admin Dashboard!";
    }
}
