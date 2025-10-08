package com.service.security.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.service.security.model.Employee;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

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
            Font subTitleFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font labelFont = new Font(Font.FontFamily.HELVETICA, 9, Font.BOLD);
            Font valueFont = new Font(Font.FontFamily.HELVETICA, 9);

            // ======= HEADER =======
            Paragraph schoolTitle = new Paragraph("NEW NATIONAL SECURITY SERVICES", titleFont);
            schoolTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(schoolTitle);

            Paragraph address = new Paragraph(
                    "H.O.: 1st Floor Hilsa Kothi, Near Post Office, Jamal Road, Patna - 800001\n" +
                            "Phone No.: 09308183643, (O) Telefax No.: 91-612-2239307\n" +
                            "B.O.: R.K. Tower, 2nd Floor Room No. 117, Opp. Akashvani, Adityapur, Jamshedpur-13 (Jharkhand)\n" +
                            "Ph.: 09386598498\n\n",
                    valueFont);
            address.setAlignment(Element.ALIGN_CENTER);
            document.add(address);

            document.add(new LineSeparator());
            document.add(Chunk.NEWLINE);

            // ======= TITLE =======
            Paragraph formTitle = new Paragraph("EMPLOYEE REGISTRATION FORM", subTitleFont);
            formTitle.setAlignment(Element.ALIGN_CENTER);
            formTitle.setSpacingAfter(10);
            document.add(formTitle);

            // ======= BASIC DETAILS =======
            addSectionHeader(document, "Basic Details", subTitleFont);
            PdfPTable basicTable = new PdfPTable(4);
            basicTable.setWidthPercentage(100);
            basicTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(basicTable, "Through", emp.getThrough(), "Phone No", emp.getPhoneNo(), labelFont, valueFont);
            addRow(basicTable, "Name", emp.getName(), "Mobile", emp.getMobile(), labelFont, valueFont);
            addRow(basicTable, "Father's Name", emp.getFatherName(), "Occupation", emp.getFatherOccupation(), labelFont, valueFont);
            addRow(basicTable, "Age", String.valueOf(emp.getAge()), "Village", emp.getVillage(), labelFont, valueFont);
            addRow(basicTable, "District", emp.getDistrict(), "Block", emp.getBlock(), labelFont, valueFont);
            addRow(basicTable, "Subdivision", emp.getSubdivision(), "Pin Code", emp.getPinCode(), labelFont, valueFont);
            addRow(basicTable, "Qualification", emp.getQualification(), "Nearest Railway Station", emp.getNearestRailwayStation(), labelFont, valueFont);
            document.add(basicTable);
            document.add(Chunk.NEWLINE);

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
            document.add(Chunk.NEWLINE);

            // ======= BANK DETAILS =======
            addSectionHeader(document, "Bank Details", subTitleFont);
            PdfPTable bankTable = new PdfPTable(4);
            bankTable.setWidthPercentage(100);
            bankTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(bankTable, "Account Holder", emp.getAccountHolderName(), "Bank Name", emp.getBankName(), labelFont, valueFont);
            addRow(bankTable, "Branch", emp.getBranch(), "Branch Code", emp.getBranchCode(), labelFont, valueFont);
            addRow(bankTable, "Account No", emp.getAccountNo(), "", "", labelFont, valueFont);
            document.add(bankTable);
            document.add(Chunk.NEWLINE);

            // ======= FAMILY DETAILS =======
            addSectionHeader(document, "Family Details", subTitleFont);
            PdfPTable familyTable = new PdfPTable(4);
            familyTable.setWidthPercentage(100);
            familyTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(familyTable, "Mother's Name", emp.getMotherName(), "Occupation", emp.getMotherOccupation(), labelFont, valueFont);
            addRow(familyTable, "Wife's Name", emp.getWifeName(), "Occupation", emp.getWifeOccupation(), labelFont, valueFont);
            addRow(familyTable, "Sons", emp.getSons(), "Daughters", emp.getDaughters(), labelFont, valueFont);
            document.add(familyTable);
            document.add(Chunk.NEWLINE);

            // ======= FEE DETAILS =======
            addSectionHeader(document, "Fee Details", subTitleFont);
            PdfPTable feeTable = new PdfPTable(6);
            feeTable.setWidthPercentage(100);
            feeTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            addRow(feeTable, "Total Fee", String.valueOf(emp.getTotalFee()), "Paid Amount", String.valueOf(emp.getPaidAmount()), labelFont, valueFont);
            addRow(feeTable, "Balance", String.valueOf(emp.getBalance()), "Post", emp.getPost(), labelFont, valueFont);
            addRow(feeTable, "Appointment Unit", emp.getAppointmentUnit(), "", "", labelFont, valueFont);
            document.add(feeTable);
            document.add(Chunk.NEWLINE);

            // ======= SIGNATURE AREA =======
            document.add(new LineSeparator());
            document.add(Chunk.NEWLINE);

            Paragraph signature = new Paragraph(
                    "Applicant Signature: ___________________     Date: ____________\n\n" +
                            "Office Incharge Signature: _______________     Date: ____________\n\n" +
                            "Proprietor / Authorized Signature",
                    valueFont);
            signature.setSpacingBefore(15);
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
}
