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
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class EmployeeService {

    // Only these image types are accepted for the employee photo. Previously
    // any file at all was accepted and the caller-supplied file name was
    // appended as-is into the stored path.
    private static final Set<String> ALLOWED_PHOTO_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");
    private static final Set<String> ALLOWED_PHOTO_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");

    private final EmployeeRepository repo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    // Create
    public Employee saveEmployee(Employee employee, MultipartFile photo) throws IOException {
        if (photo != null && !photo.isEmpty()) {

            String extension = extractExtension(photo.getOriginalFilename());
            String contentType = photo.getContentType();

            if (extension == null || !ALLOWED_PHOTO_EXTENSIONS.contains(extension)
                    || contentType == null || !ALLOWED_PHOTO_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
                throw new IllegalArgumentException(
                        "Employee photo must be a JPG, PNG or WEBP image");
            }

            // Use the configured folder
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // File name is a fresh UUID plus only the validated extension --
            // the caller-supplied original file name is discarded entirely
            // rather than appended, so it can no longer carry unexpected
            // characters or path segments into the stored file name.
            String fileName = UUID.randomUUID() + "." + extension;
            Path filePath = uploadPath.resolve(fileName);

            // Save file permanently
            Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save relative path for easy access in PDF
            employee.setPhoto("uploads/employees/" + fileName);
        }

        return repo.save(employee);
    }

    /**
     * Returns the lowercased extension (without the dot), or null if the
     * file name is missing, has no extension, or ends with a dot.
     */
    private String extractExtension(String originalFilename) {
        if (originalFilename == null) {
            return null;
        }
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalFilename.length() - 1) {
            return null;
        }
        return originalFilename.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
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
        // These two were previously never copied over, so edits to Present
        // State / Present Pin Code on an existing employee were silently
        // discarded on update.
        emp.setPresentState(updated.getPresentState());
        emp.setPresentPinCode(updated.getPresentPinCode());

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
        // Previously this if/else chain called repo.searchEmployees(...) with
        // the exact same arguments in every branch -- it only ever decided
        // *whether* to search, never changed *how*. The real filtering
        // combination logic lives in the @Query itself (see
        // EmployeeRepository), which used to OR every field together, so
        // filling in e.g. both district and village returned anything
        // matching *either* one instead of narrowing the results.
        name = blankToNull(name);
        mobile = blankToNull(mobile);
        fatherName = blankToNull(fatherName);
        district = blankToNull(district);
        village = blankToNull(village);
        through = blankToNull(through);

        if (name == null && mobile == null && fatherName == null
                && district == null && village == null && through == null) {
            return List.of(); // empty list when nothing searched
        }

        return repo.searchEmployees(name, mobile, fatherName, district, village, through);
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

}
