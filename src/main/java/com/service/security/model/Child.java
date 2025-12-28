package com.service.security.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class Child {

    private String name;
    private LocalDate dateOfBirth;
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
