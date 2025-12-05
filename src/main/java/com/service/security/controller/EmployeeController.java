package com.service.security.controller;

import com.service.security.model.Employee;
import com.service.security.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String mobile,
            @RequestParam(required = false) String fatherName) {
        return service.searchEmployees(name, mobile, fatherName);
    }
}
