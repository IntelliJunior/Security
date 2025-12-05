package com.service.security.repository;

import com.service.security.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findAllByOrderByRegisteredAtDesc();

    List<Employee> findByNameContainingIgnoreCase(String name);

    List<Employee> findByMobileContaining(String mobile);

    List<Employee> findByFatherNameContainingIgnoreCase(String fatherName);

    // Optional advanced version - one endpoint for all
    @Query("SELECT e FROM Employee e WHERE " +
            "(:name IS NOT NULL AND LOWER(e.name) LIKE LOWER(CONCAT(:name, '%'))) " +
            "OR (:mobile IS NOT NULL AND e.mobile LIKE CONCAT(:mobile, '%')) " +
            "OR (:fatherName IS NOT NULL AND LOWER(e.fatherName) LIKE LOWER(CONCAT(:fatherName, '%')))")
    List<Employee> searchEmployees(@Param("name") String name,
                                   @Param("mobile") String mobile,
                                   @Param("fatherName") String fatherName);

}
