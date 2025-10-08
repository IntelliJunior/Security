package com.service.security.service;

import com.service.security.model.Employee;
import com.service.security.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    // Create
    public Employee saveEmployee(Employee employee) {
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
        emp.setFatherName(updated.getFatherName());
        emp.setFatherOccupation(updated.getFatherOccupation());
        emp.setAge(updated.getAge());
        emp.setVillage(updated.getVillage());
        emp.setPo(updated.getPo());
        emp.setBlock(updated.getBlock());
        emp.setSubdivision(updated.getSubdivision());
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
        emp.setWardNo(updated.getWardNo());
        emp.setPresentPo(updated.getPresentPo());
        emp.setPresentPs(updated.getPresentPs());
        emp.setPresentDistrict(updated.getPresentDistrict());

        // Family details
        emp.setMotherName(updated.getMotherName());
        emp.setMotherOccupation(updated.getMotherOccupation());
        emp.setMotherAge(updated.getMotherAge());
        emp.setWifeName(updated.getWifeName());
        emp.setWifeOccupation(updated.getWifeOccupation());
        emp.setWifeAge(updated.getWifeAge());
        emp.setSons(updated.getSons());
        emp.setDaughters(updated.getDaughters());

        // Fees & post details
        emp.setTotalFee(updated.getTotalFee());
        emp.setPaidAmount(updated.getPaidAmount());
        emp.setBalance(updated.getBalance());
        emp.setAppointmentUnit(updated.getAppointmentUnit());
        emp.setPost(updated.getPost());

        return repo.save(emp);
    }

    // Delete
    public void deleteEmployee(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Employee not found with ID: " + id);
        }
        repo.deleteById(id);
    }
}
