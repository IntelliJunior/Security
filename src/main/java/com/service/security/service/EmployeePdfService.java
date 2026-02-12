package com.service.security.service;


import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.service.security.model.Child;
import com.service.security.model.Employee;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmployeePdfService {

    public ByteArrayInputStream generateEmployeePdf(Employee emp) {
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // ======= FONTS =======
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.BLUE);
            Font subTitleFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
            Font labelFont = new Font(Font.FontFamily.HELVETICA, 8, Font.BOLD);
            Font valueFont = new Font(Font.FontFamily.HELVETICA, 8);

            // ======= HEADER =======
            Paragraph companyName = new Paragraph("NEW NATIONAL SECURITY SERVICES", titleFont);
            companyName.setAlignment(Element.ALIGN_CENTER);
            document.add(companyName);

            Paragraph address = new Paragraph(
                    "1st Floor, Flat No. 106, Meridian S. S. Vihar Apartment, Main Road, Karbigahiya, Patna – 800001\n" +
                            "E-mail: nnssbr@gmail.com, system_care@hotmail.com, Ph-0612 2341000, Mob-9334641000\n\n",
                    valueFont);
            address.setAlignment(Element.ALIGN_CENTER);
            document.add(address);

            document.add(new LineSeparator());
            //document.add(Chunk.NEWLINE);

            // ======= TITLE =======
            // ======= TITLE WITH DATE OF JOINING =======
            PdfPTable titleTable = new PdfPTable(3);
            titleTable.setWidthPercentage(100);
            titleTable.setWidths(new float[]{40, 30, 30});
            titleTable.setSpacingBefore(10);
            titleTable.setSpacingAfter(10);

            // ---- Left: Registration Form ----
            String regForm = emp.getDate() != null
                    ? formatDate(emp.getDate()) + "/NNSS/" +
                    emp.getPresentState() + "/" +
                    emp.getPresentDistrict() + "/" +
                    emp.getId()
                    : "";

            PdfPCell regCell = new PdfPCell(
                    new Paragraph("Reg. Form: " + regForm, valueFont)
            );
            regCell.setBorder(Rectangle.NO_BORDER);
            regCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            regCell.setVerticalAlignment(Element.ALIGN_MIDDLE);


            Paragraph test = new Paragraph("THIS IS NEW VERSION 2026", valueFont);
            document.add(test);
// ---- Left: Title ----
            PdfPCell titleCell = new PdfPCell(
                    new Paragraph("EMPLOYEE REGISTRATION FORM", subTitleFont)
            );
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            // ---- Right: Date of Joining ----
            String doj = emp.getDate() != null
                    ? formatDate(emp.getDate())
                    : "";

            Paragraph dojPara = new Paragraph("Date of Joining: " + doj, valueFont);
            dojPara.setAlignment(Element.ALIGN_RIGHT);

            PdfPCell dojCell = new PdfPCell(dojPara);
            dojCell.setBorder(Rectangle.NO_BORDER);
            dojCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            dojCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            //regCell.setNoWrap(true);
            dojCell.setNoWrap(true);


            // Add cells
            titleTable.addCell(regCell);    // LEFT
            titleTable.addCell(titleCell);  // CENTER
            titleTable.addCell(dojCell);    // RIGHT


            // Spacing
            //titleTable.setSpacingAfter(10);

            // Add to document
            document.add(titleTable);


            // ======= BASIC DETAILS SECTION + PHOTO SIDE BY SIDE =======
            PdfPTable headerTable = new PdfPTable(new float[]{3, 1});
            headerTable.setWidthPercentage(100);
            headerTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            // LEFT CELL - BASIC DETAILS
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);

            Paragraph basicHeader = new Paragraph("Basic Details:", subTitleFont);
            basicHeader.setSpacingAfter(5);
            leftCell.addElement(basicHeader);

            PdfPTable basicTable = new PdfPTable(4);
            basicTable.setWidthPercentage(100);
            basicTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(basicTable, "Through", emp.getThrough(), "Phone No", emp.getPhoneNo(), labelFont, valueFont);
            addRow(basicTable, "Name", emp.getName(), "Mobile", emp.getMobile(), labelFont, valueFont);
            addRow(basicTable, "Employee Aadhar", emp.getEmployeeAadhar(), "Employee UAN Number", emp.getEmployeeUan(), labelFont, valueFont);
            addRow(basicTable, "Employee Insurance Number", emp.getEmployeeInsuranceNo(), "Employee PF Number", emp.getEmployeePfNo(), labelFont, valueFont);
            addRow(basicTable, "Date of Birth", emp.getDateOfBirth() != null ? formatDate(emp.getDateOfBirth()) : "", "Village", emp.getVillage(), labelFont, valueFont);
            addRow(basicTable, "District", emp.getDistrict(), "Pin Code", emp.getPinCode(), labelFont, valueFont);
            addRow(basicTable, "Qualification", emp.getQualification(), "Nearest Railway Station", emp.getNearestRailwayStation(), labelFont, valueFont);
            leftCell.addElement(basicTable);

            headerTable.addCell(leftCell);

            // RIGHT CELL - PHOTO
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setVerticalAlignment(Element.ALIGN_TOP);
            rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);

            if (emp.getPhoto() != null && !emp.getPhoto().isEmpty()) {
                try {
                    // Normalize and resolve actual path
                    String relativePath = emp.getPhoto().replace("\\", "/");
                    Path imagePath = Paths.get("src/main/resources/static", relativePath);

                    if (Files.exists(imagePath)) {
                        Image empPhoto = Image.getInstance(imagePath.toAbsolutePath().toString());
                        empPhoto.scaleToFit(100, 100); // photo size
                        empPhoto.setAlignment(Element.ALIGN_RIGHT);
                        rightCell.addElement(empPhoto);
                    } else {
                        System.out.println("⚠️ Photo not found at: " + imagePath.toAbsolutePath());
                    }
                } catch (Exception imgEx) {
                    imgEx.printStackTrace();
                }
            }

            headerTable.addCell(rightCell);
            document.add(headerTable);
            //document.add(Chunk.NEWLINE);

            // ======= PHYSICAL DETAILS =======
            addSectionHeader(document, "Physical Details", subTitleFont);
            PdfPTable pTable = new PdfPTable(4);
            pTable.setWidthPercentage(100);
            pTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(pTable, "Chest", emp.getChest(), "Waist", emp.getWaist(), labelFont, valueFont);
            addRow(pTable, "Pant Length", emp.getPantLength(), "Weight", emp.getWeight(), labelFont, valueFont);
            addRow(pTable, "Height", emp.getHeight(), "Blood Group", emp.getBloodGroup(), labelFont, valueFont);
            addRow(pTable, "Identification Mark 1", emp.getIdentificationMark1(), "Identification Mark 2", emp.getIdentificationMark2(), labelFont, valueFont);
            document.add(pTable);
            //document.add(Chunk.NEWLINE);

            // ======= BANK DETAILS =======
            addSectionHeader(document, "Bank Details", subTitleFont);
            PdfPTable bankTable = new PdfPTable(4);
            bankTable.setWidthPercentage(100);
            bankTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(bankTable, "Account Holder", emp.getAccountHolderName(), "Bank Name", emp.getBankName(), labelFont, valueFont);
            addRow(bankTable, "Branch", emp.getBranch(), "IFSC Code", emp.getBranchCode(), labelFont, valueFont);
            addRow(bankTable, "Account No", emp.getAccountNo(), "", "", labelFont, valueFont);
            document.add(bankTable);
            //document.add(Chunk.NEWLINE);

            // ======= PRESENT ADDRESS DETAILS =======
            addSectionHeader(document, "Present Address", subTitleFont);
            PdfPTable presentAddressTable = new PdfPTable(4);
            presentAddressTable.setWidthPercentage(100);
            presentAddressTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(presentAddressTable, "C/O", emp.getCareOf(), "Mohalla", emp.getMoh(), labelFont, valueFont);
            addRow(presentAddressTable, "Phone/Mobile", emp.getAddressPhone(), "House No", emp.getHouseNo(), labelFont, valueFont);
            addRow(presentAddressTable, "Road No", emp.getRoadNo(), "PO", emp.getPresentPo(), labelFont, valueFont);
            addRow(presentAddressTable, "PS", emp.getPresentPs(), "District", emp.getPresentDistrict(), labelFont, valueFont);
            addRow(presentAddressTable, "State", emp.getPresentState(), "Pin Code", emp.getPresentPinCode(), labelFont, valueFont);
            document.add(presentAddressTable);
            //document.add(Chunk.NEWLINE);

            // ======= FAMILY DETAILS =======
            addSectionHeader(document, "Family Details", subTitleFont);

            PdfPTable familyTable = new PdfPTable(8);
            familyTable.setWidthPercentage(100);
            familyTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            // ===== Father =====
            addRow(
                    familyTable,
                    "Father's Name", emp.getFatherName(),
                    "Father's DOB", formatDate(emp.getFatherDateOfBirth()),
                    "Occupation", emp.getFatherOccupation(),
                    "Aadhar", emp.getFatherAadhar(),
                    labelFont, valueFont
            );

            // ===== Mother =====
            addRow(
                    familyTable,
                    "Mother's Name", emp.getMotherName(),
                    "Mother's DOB", formatDate(emp.getMotherDateOfBirth()),
                    "Occupation", emp.getMotherOccupation(),
                    "Aadhar", emp.getMotherAadhar(),
                    labelFont, valueFont
            );

            // ===== Wife =====
            addRow(
                    familyTable,
                    "Wife's Name", emp.getWifeName(),
                    "Wife's DOB", formatDate(emp.getWifeDateOfBirth()),
                    "Occupation", emp.getWifeOccupation(),
                    "Aadhar", emp.getWifeAadhar(),
                    labelFont, valueFont
            );
            document.add(familyTable);
            addSectionHeader(document, "Children Details", subTitleFont);

            PdfPTable childTable = new PdfPTable(2);
            childTable.setWidthPercentage(100);
            childTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            // Sons
            childTable.addCell(new Phrase("Sons:", labelFont));
            childTable.addCell(new Phrase(formatChildren(emp.getSons()), valueFont));

            // Daughters
            childTable.addCell(new Phrase("Daughters:", labelFont));
            childTable.addCell(new Phrase(formatChildren(emp.getDaughters()), valueFont));

            document.add(childTable);


            //document.add(Chunk.NEWLINE);

            // ======= FEE DETAILS =======
            addSectionHeader(document, "Fee Details", subTitleFont);
            PdfPTable feeTable = new PdfPTable(6);
            feeTable.setWidthPercentage(100);
            feeTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(feeTable, "Total Fee", String.valueOf(emp.getTotalFee()), "Paid Amount", String.valueOf(emp.getPaidAmount()), labelFont, valueFont);
            addRow(feeTable, "Balance", String.valueOf(emp.getBalance()), "Post", emp.getPost(), labelFont, valueFont);
            addRow(feeTable, "Appointment Unit", emp.getAppointmentUnit(), "", "", labelFont, valueFont);
            document.add(feeTable);

            // ======= ARMS GUARD DETAILS =======
            if ("Arms Guard".equalsIgnoreCase(emp.getPost())) {
                addSectionHeader(document, "Arms Guard Details", subTitleFont);
                PdfPTable armsTable = new PdfPTable(4);
                armsTable.setWidthPercentage(100);
                armsTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
                addRow(armsTable,"Licence No", emp.getLicenseNo(),"Valid Area", emp.getValidArea(), labelFont, valueFont );
                addRow(armsTable,"Renewal Upto", emp.getRenewalUpto() != null ? formatDate(emp.getRenewalUpto()) : "","", "", labelFont, valueFont );
                document.add(armsTable);
            }
            document.add(Chunk.NEWLINE);

            // ======= SIGNATURE AREA =======
            document.add(new LineSeparator());
            //document.add(Chunk.NEWLINE);

            Paragraph signature = new Paragraph(
                    "Applicant Signature: ___________________     Date: ____________\n\n" +
                            "Office Incharge Signature: _______________     Date: ____________                            Proprietor / Authorized Signature", valueFont);
            signature.setSpacingBefore(10);
            document.add(signature);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addSectionHeader(Document document, String title, Font font) throws DocumentException {
        Paragraph section = new Paragraph(title + ":", font);
        section.setSpacingBefore(5);
        section.setSpacingAfter(5);
        section.setAlignment(Element.ALIGN_LEFT);
        document.add(section);
    }

    private void addRow(PdfPTable table, String label1, Object value1, String label2, Object value2, Font labelFont, Font valueFont) {
        table.addCell(new Phrase(label1 + ":", labelFont));
        table.addCell(new Phrase(value1 != null ? value1.toString() : "", valueFont));
        table.addCell(new Phrase(label2 + ":", labelFont));
        table.addCell(new Phrase(value2 != null ? value2.toString() : "", valueFont));
    }

    private String formatChildren(List<Child> children) {
        if (children == null || children.isEmpty()) return "N/A";

        StringBuilder sb = new StringBuilder();
        for (Child c : children) {
            sb.append(c.getName())
                    .append(" | DOB: ")
                    .append(formatDate(c.getDateOfBirth()))
                    .append(" | Aadhaar: ")
                    .append(c.getAadhar() != null ? c.getAadhar() : "—")
                    .append("\n");
        }
        return sb.toString();
    }

    private void addRow(
            PdfPTable table,
            String label1, Object value1,
            String label2, Object value2,
            String label3, Object value3,
            String label4, Object value4,
            Font labelFont, Font valueFont
    ) {
        table.addCell(new Phrase(label1 + ":", labelFont));
        table.addCell(new Phrase(value1 != null ? value1.toString() : "", valueFont));

        table.addCell(new Phrase(label2 + ":", labelFont));
        table.addCell(new Phrase(value2 != null ? value2.toString() : "", valueFont));

        table.addCell(new Phrase(label3 + ":", labelFont));
        table.addCell(new Phrase(value3 != null ? value3.toString() : "", valueFont));

        table.addCell(new Phrase(label4 + ":", labelFont));
        table.addCell(new Phrase(value4 != null ? value4.toString() : "", valueFont));
    }

    private String formatDate(LocalDate date) {
        return date != null ? date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) : "";
    }

}
