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

    List<Employee> findByDistrictContainingIgnoreCase(String district);

    List<Employee> findByVillageContainingIgnoreCase(String village);

    List<Employee> findByThroughContainingIgnoreCase(String through);

    // Combines filters with AND (each one supplied narrows the results), not
    // OR. Previously this used OR, so supplying more than one filter (e.g.
    // district + village together) returned everything matching *either*
    // field instead of the intersection -- searching got broader, not more
    // specific, the more criteria you filled in. A null parameter still
    // means "don't filter on this field" either way.
    @Query("SELECT e FROM Employee e WHERE " +
            "(:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT(:name, '%'))) " +
            "AND (:mobile IS NULL OR e.mobile LIKE CONCAT(:mobile, '%')) " +
            "AND (:fatherName IS NULL OR LOWER(e.fatherName) LIKE LOWER(CONCAT(:fatherName, '%'))) " +
            "AND (:district IS NULL OR LOWER(e.district) LIKE LOWER(CONCAT(:district, '%'))) " +
            "AND (:village IS NULL OR LOWER(e.village) LIKE LOWER(CONCAT(:village, '%'))) " +
            "AND (:through IS NULL OR LOWER(e.through) LIKE LOWER(CONCAT(:through, '%'))) " +
            "ORDER BY e.registeredAt DESC")
    List<Employee> searchEmployees(@Param("name") String name,
                                   @Param("mobile") String mobile,
                                   @Param("fatherName") String fatherName,
                                   @Param("district") String district,
                                   @Param("village") String village,
                                   @Param("through") String through);

}
