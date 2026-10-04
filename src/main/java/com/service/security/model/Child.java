package com.service.security.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Embeddable
public class Child {

    @Size(max = 50, message = "Child name must be at most 50 characters")
    private String name;

    private LocalDate dateOfBirth;

    // Same 12-digit rule used for every other Aadhar field in this system
    @Pattern(regexp = "^$|^[0-9]{12}$", message = "Child Aadhar must be exactly 12 digits")
    private String aadhar;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAadhar() {
        return aadhar;
    }

    public void setAadhar(String aadhar) {
        this.aadhar = aadhar;
    }
}
