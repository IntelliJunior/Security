package com.service.security.service;

import com.service.security.model.Child;
import com.service.security.model.Employee;
import com.service.security.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    // Create
    public Employee saveEmployee(Employee employee, MultipartFile photo) throws IOException {
        if (photo != null && !photo.isEmpty()) {

            // Use the configured folder
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Unique file name
            String fileName = UUID.randomUUID() + "_" + photo.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // Save file permanently
            Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save relative path for easy access in PDF
            employee.setPhoto("uploads/employees/" + fileName);
        }

        return repo.save(employee);
    }



    // Read all (latest first)
    public List<Employee> getAllEmployeesDesc() {
        return repo.findAllByOrderByRegisteredAtDesc();
    }

    // Read single
    public Employee getEmployeeById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
    }

    // Update
    public Employee updateEmployee(Long id, Employee updated) {
        Employee emp = getEmployeeById(id);

        // Basic details
        emp.setThrough(updated.getThrough());
        emp.setPhoneNo(updated.getPhoneNo());
        emp.setDate(updated.getDate());
        emp.setName(updated.getName());
        emp.setMobile(updated.getMobile());
        emp.setEmployeeAadhar(updated.getEmployeeAadhar());
        emp.setEmployeeUan(updated.getEmployeeUan());
        emp.setEmployeeInsuranceNo(updated.getEmployeeInsuranceNo());
        emp.setEmployeePfNo(updated.getEmployeePfNo());
        emp.setDateOfBirth(updated.getDateOfBirth());
        emp.setFatherName(updated.getFatherName());
        emp.setFatherOccupation(updated.getFatherOccupation());
        emp.setFatherDateOfBirth(updated.getFatherDateOfBirth());
        emp.setFatherAadhar(updated.getFatherAadhar());
        emp.setVillage(updated.getVillage());
        emp.setPo(updated.getPo());
        emp.setDistrict(updated.getDistrict());
        emp.setPinCode(updated.getPinCode());
        emp.setQualification(updated.getQualification());
        emp.setNearestRailwayStation(updated.getNearestRailwayStation());

        // Physical details
        emp.setIdentificationMark1(updated.getIdentificationMark1());
        emp.setIdentificationMark2(updated.getIdentificationMark2());
        emp.setChest(updated.getChest());
        emp.setWaist(updated.getWaist());
        emp.setPantLength(updated.getPantLength());
        emp.setWeight(updated.getWeight());
        emp.setHeight(updated.getHeight());
        emp.setBloodGroup(updated.getBloodGroup());

        // Bank details
        emp.setAccountHolderName(updated.getAccountHolderName());
        emp.setBankName(updated.getBankName());
        emp.setBranchCode(updated.getBranchCode());
        emp.setAccountNo(updated.getAccountNo());
        emp.setBranch(updated.getBranch());

        // Present address
        emp.setCareOf(updated.getCareOf());
        emp.setMoh(updated.getMoh());
        emp.setAddressPhone(updated.getAddressPhone());
        emp.setHouseNo(updated.getHouseNo());
        emp.setRoadNo(updated.getRoadNo());
        emp.setPresentPo(updated.getPresentPo());
        emp.setPresentPs(updated.getPresentPs());
        emp.setPresentDistrict(updated.getPresentDistrict());

        // Family details
        emp.setMotherName(updated.getMotherName());
        emp.setMotherOccupation(updated.getMotherOccupation());
        emp.setMotherDateOfBirth(updated.getMotherDateOfBirth());
        emp.setMotherAadhar(updated.getMotherAadhar());
        emp.setWifeName(updated.getWifeName());
        emp.setWifeOccupation(updated.getWifeOccupation());
        emp.setWifeDateOfBirth(updated.getWifeDateOfBirth());
        emp.setWifeAadhar(updated.getWifeAadhar());
        // -------- SONS --------
        emp.getSons().clear();
        if (updated.getSons() != null) {
            updated.getSons().forEach(s -> {
                Child child = new Child();
                child.setName(s.getName());
                child.setDateOfBirth(s.getDateOfBirth());
                child.setAadhar(s.getAadhar());
                emp.getSons().add(child);
            });
        }

// -------- DAUGHTERS --------
        emp.getDaughters().clear();
        if (updated.getDaughters() != null) {
            updated.getDaughters().forEach(d -> {
                Child child = new Child();
                child.setName(d.getName());
                child.setDateOfBirth(d.getDateOfBirth());
                child.setAadhar(d.getAadhar());
                emp.getDaughters().add(child);
            });
        }


        // Fees & post details
        emp.setTotalFee(updated.getTotalFee());
        emp.setPaidAmount(updated.getPaidAmount());
        emp.setBalance(updated.getBalance());
        emp.setAppointmentUnit(updated.getAppointmentUnit());
        emp.setPost(updated.getPost());
        emp.setLicenseNo(updated.getLicenseNo());
        emp.setValidArea(updated.getValidArea());
        emp.setRenewalUpto(updated.getRenewalUpto());

        return repo.save(emp);
    }

    // Delete
    public void deleteEmployee(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Employee not found with ID: " + id);
        }
        repo.deleteById(id);
    }

    public List<Employee> searchEmployees(String name, String mobile, String fatherName, String district, String village, String through) {
        if (name != null && !name.isBlank()) {
            return repo.searchEmployees(name, mobile, fatherName, district, village, through);
        } else if (mobile != null && !mobile.isBlank()) {
            return repo.searchEmployees(name, mobile, fatherName, district, village, through);
        } else if (fatherName != null && !fatherName.isBlank()) {
            return repo.searchEmployees(name, mobile, fatherName, district, village, through);
        }else if (district != null && !district.isBlank()) {
            return repo.searchEmployees(name, mobile, fatherName, district, village, through);
        }else if (village != null && !village.isBlank()) {
            return repo.searchEmployees(name, mobile, fatherName, district, village, through);
        }else if (through != null && !through.isBlank()) {
            return repo.searchEmployees(name, mobile, fatherName, district, village, through);
        } else {
            return List.of(); // empty list when nothing searched
        }
    }

}
