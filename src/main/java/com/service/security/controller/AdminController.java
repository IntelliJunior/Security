package com.service.security.controller;

import com.service.security.model.Employee;
import com.service.security.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EmployeeService employeeService;

    public AdminController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Register employee
    @PostMapping("/employees/register")
    public ResponseEntity<Employee> registerEmployee(@Valid @RequestBody Employee employee) {
        Employee saved = employeeService.saveEmployee(employee);
        return ResponseEntity.ok(saved);
    }

    // List all employees (descending by registration date)
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> list = employeeService.getAllEmployeesDesc();
        return ResponseEntity.ok(list);
    }

    // Get employee by ID (for pre-filling edit form)
    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee emp = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(emp);
    }

    // Update employee
    @PutMapping("/employees/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        Employee updated = employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok(updated);
    }

    // Delete employee
    @DeleteMapping("/employees/{id}")
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
