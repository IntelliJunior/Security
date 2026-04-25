package com.service.security.controller;

import com.service.security.model.Employee;
import com.service.security.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "*")
@Tag(name = "Employee", description = "API to search Employee")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping("/search")
    @Operation(summary = "Search Employee by its Name, Mobile, FatherName, District, Village, Through")
    public List<Employee> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String mobile,
            @RequestParam(required = false) String fatherName,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String village,
            @RequestParam(required = false) String through
    ) {
        return service.searchEmployees(name, mobile, fatherName, district, village, through);
    }
}
