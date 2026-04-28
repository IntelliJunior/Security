import { toast } from "react-toastify";
import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";



export const MemoizedSelect = memo(
  ({ name, value, onChange, options, required = false }) => {
    const selectValue = value ?? "";

    return (
      <select
        name={name}
        value={selectValue}
        onChange={onChange}
        required={required}
        className="border p-2 rounded bg-white"
      >
        <option value="">-- Select Post --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
);

const POST_OPTIONS = [
  "S/G",
  "H/G",
  "S/S",
  "Sr/S/S",
  "S/Ins",
  "Arms Guard",
  "S/Officer",
  "Labour",
  "Helper",
  "Civil Supervisor",
  "Bouncer",
  "Assistant Manager",
];


// Memoized input to prevent unnecessary re-renders


const TextInput = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  const isDate = type === "date";
  const [inputType, setInputType] = useState(isDate && value ? "date" : "text");

  useEffect(() => {
    if (isDate && value) {
      setInputType("date");
    }
  }, [value, isDate]);

  return (
    <input
      type={inputType}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={inputType === "text" ? placeholder : ""}
      required={required}
      className="border p-2 rounded w-full"
      autoComplete="off"
      onFocus={() => isDate && setInputType("date")}
      onBlur={() => {
        if (isDate && !value) {
          setInputType("text");
        }
      }}
    />
  );
};


// Section component
const Section = ({ title, children }) => (
  <div className="border p-4 rounded mb-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
  </div>
);


// Initial form state
const initialFormState = {
  through: "",
  phoneNo: "",
  date: new Date().toISOString().split("T")[0],
  name: "",
  mobile: "",
  fatherName: "",
  fatherOccupation: "",
  fatherDateOfBirth: "",     // ✅ ADD
  dateOfBirth: "",
  village: "",
  po: "",
  block: "",
  subdivision: "",
  district: "",
  pinCode: "",
  qualification: "",
  nearestRailwayStation: "",
  identificationMark1: "",
  identificationMark2: "",
  chest: "",
  waist: "",
  pantLength: "",
  weight: "",
  height: "",
  bloodGroup: "",
  accountHolderName: "",
  bankName: "",
  branchCode: "",
  accountNo: "",
  branch: "",
  careOf: "",
  moh: "",
  addressPhone: "",
  houseNo: "",
  roadNo: "",
  wardNo: "",
  presentPo: "",
  presentPs: "",
  presentDistrict: "",
  presentState: "",
  presentPinCode: "",
  motherName: "",
  motherOccupation: "",
  motherDateOfBirth: "",
  wifeName: "",
  wifeOccupation: "",
  wifeDateOfBirth: "",
  sons: [{ name: "", dateOfBirth: "", aadhar: "" }],
  daughters: [{ name: "", dateOfBirth: "", aadhar: "" }],
  totalFee: "",
  paidAmount: "",
  balance: "",
  appointmentUnit: "",
  post: "",
  licenseNo: "",
  validArea: "",
  renewalUpto: "",

   // ===== Employee IDs =====
    employeeAadhar: "",
    employeeUan: "",
    employeeInsuranceNo: "",
    employeePfNo: "",

    // ===== Family Aadhar =====
    fatherAadhar: "",
    motherAadhar: "",
    wifeAadhar: "",
};

export default function RegisterEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const isArmsGuard = form.post === "Arms Guard";


    const [errors, setErrors] = useState({});

  const validate = () => {
    let e = {};

    // -----------------------------
    // REQUIRED / EXISTING CHECKS
    // -----------------------------
    if (!form.name || form.name.trim().length < 3) {
      e.name = "Employee name must be at least 3 characters";
    }

    if (!form.fatherName) {
      e.fatherName = "Father name is required";
    }

// -----------------------------
        // PHONE / MOBILE VALIDATION
        // -----------------------------

        // phoneNo => max 2 numbers separated by comma
        if (form.phoneNo) {
          const phoneParts = form.phoneNo
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean);

          if (phoneParts.length > 2) {
            e.phoneNo = "Phone No can contain maximum 2 numbers";
          } else if (!phoneParts.every((num) => /^[0-9]{10}$/.test(num))) {
            e.phoneNo = "Each Phone No must be exactly 10 digits";
          }
        }

        if (form.mobile) {
          const mobileParts = form.mobile
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean);

          if (mobileParts.length > 5) {
            e.mobile = "Mobile No can contain maximum 5 numbers";
          } else if (!mobileParts.every((num) => /^[0-9]{10}$/.test(num))) {
            e.mobile = "Each Mobile No must be exactly 10 digits";
          }
        }



    // -----------------------------
    // LENGTH VALIDATION (Employee.java)
    // -----------------------------

    const maxLen = (field, label, len) => {
        // Add inside validate() function
      if (form[field] && form[field].trim().length > len) {
        e[field] = `${label} must be less than or equal to ${len} characters`;
      }
    };



    // Basic details
    maxLen("through", "Through", 30);
    maxLen("phoneNo", "Phone No", 21);
    maxLen("name", "Name", 50);
    maxLen("mobile", "Mobile", 54);
    maxLen("fatherName", "Father Name", 50);
    maxLen("fatherOccupation", "Father Occupation", 50);

    maxLen("employeeAadhar", "Employee Aadhar", 12);
    maxLen("employeeUan", "Employee UAN", 12);
    maxLen("employeeInsuranceNo", "Employee Insurance No", 12);
    maxLen("employeePfNo", "Employee PF No", 20);

    maxLen("fatherAadhar", "Father Aadhar", 12);
    maxLen("motherAadhar", "Mother Aadhar", 12);
    maxLen("wifeAadhar", "Wife Aadhar", 12);

    maxLen("village", "Village", 30);
    maxLen("po", "PO", 30);
    maxLen("district", "District", 30);
    maxLen("pinCode", "Pin Code", 6);
    maxLen("qualification", "Qualification", 30);
    maxLen("nearestRailwayStation", "Nearest Railway Station", 30);

    // Physical
    maxLen("identificationMark1", "Identification Mark 1", 50);
    maxLen("identificationMark2", "Identification Mark 2", 50);
    maxLen("chest", "Chest", 30);
    maxLen("waist", "Waist", 30);
    maxLen("pantLength", "Pant Length", 30);
    maxLen("weight", "Weight", 30);
    maxLen("height", "Height", 30);
    maxLen("bloodGroup", "Blood Group", 30);

    // Bank
    maxLen("accountHolderName", "Account Holder Name", 50);
    maxLen("bankName", "Bank Name", 50);
    maxLen("branchCode", "IFSC Code", 50);
    maxLen("accountNo", "Account No", 50);
    maxLen("branch", "Branch", 50);

    // Present Address
    maxLen("careOf", "Care Of", 50);
    maxLen("moh", "Mohalla", 50);
    maxLen("addressPhone", "Address Phone", 55);
    maxLen("houseNo", "House No", 50);
    maxLen("roadNo", "Road No", 50);
    maxLen("presentPo", "Present PO", 50);
    maxLen("presentPs", "Present PS", 50);
    maxLen("presentDistrict", "Present District", 50);
    maxLen("presentState", "Present State", 50);
    maxLen("presentPinCode", "Present Pin Code", 50);

    // Family
    maxLen("motherName", "Mother Name", 50);
    maxLen("motherOccupation", "Mother Occupation", 50);
    maxLen("wifeName", "Wife Name", 50);
    maxLen("wifeOccupation", "Wife Occupation", 50);

    // Other
    maxLen("appointmentUnit", "Appointment Unit", 50);
    maxLen("post", "Post", 50);
    maxLen("licenseNo", "License No", 50);
    maxLen("validArea", "Valid Area", 50);

    // -----------------------------
    // EXISTING NUMBER CHECKS
    // -----------------------------
    if (form.pinCode && !/^[0-9]{6}$/.test(form.pinCode)) {
      e.pinCode = "PIN must be 6 digits";
    }

    if (form.presentPinCode && !/^[0-9]{6}$/.test(form.presentPinCode)) {
      e.presentPinCode = "Present PIN must be 6 digits";
    }

    if (form.employeeAadhar && !/^[0-9]{12}$/.test(form.employeeAadhar)) {
      e.employeeAadhar = "Employee Aadhar must be 12 digits";
    }

    if (form.fatherAadhar && !/^[0-9]{12}$/.test(form.fatherAadhar)) {
      e.fatherAadhar = "Father Aadhar must be 12 digits";
    }

    if (form.motherAadhar && !/^[0-9]{12}$/.test(form.motherAadhar)) {
      e.motherAadhar = "Mother Aadhar must be 12 digits";
    }

    if (form.wifeAadhar && !/^[0-9]{12}$/.test(form.wifeAadhar)) {
      e.wifeAadhar = "Wife Aadhar must be 12 digits";
    }

    // Fee
    const total = Number(form.totalFee || 0);
    const paid = Number(form.paidAmount || 0);

    if (paid > total) {
      e.paidAmount = "Paid amount cannot exceed total fee";
    }

    // Arms Guard
    if (form.post === "Arms Guard") {
      if (!form.licenseNo) e.licenseNo = "License required";
      if (!form.validArea) e.validArea = "Valid area required";
      if (!form.renewalUpto) e.renewalUpto = "Renewal date required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updatedForm = { ...prev, [name]: value };

      // Clear Arms Guard fields if post changes
      if (name === "post" && value !== "Arms Guard") {
        updatedForm = {
          ...updatedForm,
          licenseNo: "",
          validArea: "",
          renewalUpto: "",
        };
      }

      // Auto-calculate balance
      if (name === "totalFee" || name === "paidAmount") {
        const total = Number(updatedForm.totalFee) || 0;
        const paid = Number(updatedForm.paidAmount) || 0;
        updatedForm.balance = total - paid;
      }

      return updatedForm;
    });
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleChildChange = (type, index, field, value) => {
    setForm((prev) => {
      const updated = [...prev[type]];
      updated[index][field] = value;
      return { ...prev, [type]: updated };
    });
  };

  const addChild = (type) => {
    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], { name: "", dateOfBirth: "" }],
    }));
  };

  const removeChild = (type, index) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "employee",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );

      if (photo) {
        formData.append("photo", photo);
      }

      await api.post("/admin/employees/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Employee registered successfully");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Employee Registration
        </h2>

        <form onSubmit={handleSubmit}>
          {/* BASIC DETAILS */}
          <Section title="Basic Details">
            <TextInput name="through" value={form.through} onChange={handleChange} placeholder="Through" />
            {errors.through && <p className="text-red-500 text-sm">{errors.through}</p>}
            <TextInput name="phoneNo" value={form.phoneNo} onChange={handleChange} placeholder="Phone No" />
            {errors.phoneNo && <p className="text-red-500 text-sm">{errors.phoneNo}</p>}
            <TextInput name="date" value={form.date} onChange={handleChange} placeholder="Date" type="date" />
            <TextInput name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <TextInput name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile No" required />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            <TextInput
                          name="dateOfBirth"
                          value={form.dateOfBirth}
                          onChange={handleChange}
                          placeholder="Employee Date of Birth"
                          type="date"
                          required
                        />

                        <TextInput name="employeeAadhar" value={form.employeeAadhar} onChange={handleChange} placeholder="Employee Aadhar Number" />
                        {errors.employeeAadhar && <p className="text-red-500 text-sm">{errors.employeeAadhar}</p>}
                          <TextInput
                            name="employeeUan"
                            value={form.employeeUan}
                            onChange={handleChange}
                            placeholder="Employee UAN Number"
                          />
                          {errors.employeeUan && <p className="text-red-500 text-sm">{errors.employeeUan}</p>}
                          <TextInput
                            name="employeeInsuranceNo"
                            value={form.employeeInsuranceNo}
                            onChange={handleChange}
                            placeholder="Employee Insurance Number"
                          />
                          {errors.employeeInsuranceNo && <p className="text-red-500 text-sm">{errors.employeeInsuranceNo}</p>}
                          <TextInput
                            name="employeePfNo"
                            value={form.employeePfNo}
                            onChange={handleChange}
                            placeholder="Employee PF Number"
                          />
                          {errors.employeePfNo && <p className="text-red-500 text-sm">{errors.employeePfNo}</p>}

            <TextInput name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father Name" required />
                                    {errors.fatherName && <p className="text-red-500 text-sm">{errors.fatherName}</p>}
            <TextInput name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} placeholder="Father's Occupation" />
            <TextInput
              name="fatherDateOfBirth"
              value={form.fatherDateOfBirth}
              onChange={handleChange}
              placeholder="Father's Date of Birth"
              type="date"
            />
            <TextInput name="fatherAadhar" value={form.fatherAadhar} onChange={handleChange} placeholder="Father Aadhar Number" />
            {errors.fatherAadhar && <p className="text-red-500 text-sm">{errors.fatherAadhar}</p>}
            <TextInput name="village" value={form.village} onChange={handleChange} placeholder="Village" />
            {errors.village && <p className="text-red-500 text-sm">{errors.village}</p>}
            <TextInput name="po" value={form.po} onChange={handleChange} placeholder="Post Office" />
            {errors.po && <p className="text-red-500 text-sm">{errors.po}</p>}
            <TextInput name="district" value={form.district} onChange={handleChange} placeholder="District" />
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            <TextInput name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="Pin Code" required />
                        {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
            <TextInput name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" />
            {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification}</p>}
            <TextInput name="nearestRailwayStation" value={form.nearestRailwayStation} onChange={handleChange} placeholder="Nearest Railway Station" />
            {errors.nearestRailwayStation && <p className="text-red-500 text-sm">{errors.nearestRailwayStation}</p>}
          </Section>

          {/* PHOTO UPLOAD SECTION */}
          <Section title="Employee Photo">
            <div className="flex flex-col items-center">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover mb-3 rounded border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </Section>

          {/* PHYSICAL DETAILS */}
          <Section title="Physical Details">
            <TextInput name="identificationMark1" value={form.identificationMark1} onChange={handleChange} placeholder="Identification Mark 1" />
            {errors.identificationMark1 && <p className="text-red-500 text-sm">{errors.identificationMark1}</p>}
            <TextInput name="identificationMark2" value={form.identificationMark2} onChange={handleChange} placeholder="Identification Mark 2" />
            {errors.identificationMark2 && <p className="text-red-500 text-sm">{errors.identificationMark2}</p>}
            <TextInput name="chest" value={form.chest} onChange={handleChange} placeholder="Chest" />
            {errors.chest && <p className="text-red-500 text-sm">{errors.chest}</p>}
            <TextInput name="waist" value={form.waist} onChange={handleChange} placeholder="Waist" />
            {errors.waist && <p className="text-red-500 text-sm">{errors.waist}</p>}
            <TextInput name="pantLength" value={form.pantLength} onChange={handleChange} placeholder="Pant Length" />
            {errors.pantLength && <p className="text-red-500 text-sm">{errors.pantLength}</p>}
            <TextInput name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
            <TextInput name="height" value={form.height} onChange={handleChange} placeholder="Height" />
            {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
            <TextInput name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="Blood Group" />
            {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup}</p>}
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            <TextInput name="accountHolderName" value={form.accountHolderName} onChange={handleChange} placeholder="Account Holder Name" />
            {errors.accountHolderName && <p className="text-red-500 text-sm">{errors.accountHolderName}</p>}
            <TextInput name="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" />
            {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
            <TextInput name="branchCode" value={form.branchCode} onChange={handleChange} placeholder="IFSC Code"/>
            {errors.branchCode && <p className="text-red-500 text-sm">{errors.branchCode}</p>}
            <TextInput name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="Account Number"/>
            {errors.accountNo && <p className="text-red-500 text-sm">{errors.accountNo}</p>}
            <TextInput name="branch" value={form.branch} onChange={handleChange} placeholder="Branch" />
            {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}
          </Section>

          {/* PRESENT ADDRESS */}
          <Section title="Present Address">
            <TextInput name="careOf" value={form.careOf} onChange={handleChange} placeholder="C/O" />
            {errors.careOf && <p className="text-red-500 text-sm">{errors.careOf}</p>}
            <TextInput name="moh" value={form.moh} onChange={handleChange} placeholder="Mohalla" />
            {errors.moh && <p className="text-red-500 text-sm">{errors.moh}</p>}
            <TextInput name="addressPhone" value={form.addressPhone} onChange={handleChange} placeholder="Phone/Mobile" />
            {errors.addressPhone && <p className="text-red-500 text-sm">{errors.addressPhone}</p>}
            <TextInput name="houseNo" value={form.houseNo} onChange={handleChange} placeholder="House No" />
            {errors.houseNo && <p className="text-red-500 text-sm">{errors.houseNo}</p>}
            <TextInput name="roadNo" value={form.roadNo} onChange={handleChange} placeholder="Road No" />
            {errors.roadNo && <p className="text-red-500 text-sm">{errors.roadNo}</p>}
            <TextInput name="presentPo" value={form.presentPo} onChange={handleChange} placeholder="PO" />
            {errors.presentPo && <p className="text-red-500 text-sm">{errors.presentPo}</p>}
            <TextInput name="presentPs" value={form.presentPs} onChange={handleChange} placeholder="PS" />
            {errors.presentPs && <p className="text-red-500 text-sm">{errors.presentPs}</p>}
            <TextInput name="presentDistrict" value={form.presentDistrict} onChange={handleChange} placeholder="District" />
            {errors.presentDistrict && <p className="text-red-500 text-sm">{errors.presentDistrict}</p>}
            <TextInput name="presentState" value={form.presentState} onChange={handleChange} placeholder="State" />
            {errors.presentState && <p className="text-red-500 text-sm">{errors.presentState}</p>}
            <TextInput name="presentPinCode" value={form.presentPinCode} onChange={handleChange} placeholder="Pin Code"/>
            {errors.presentPinCode && <p className="text-red-500 text-sm">{errors.presentPinCode}</p>}
          </Section>

          {/* FAMILY DETAILS */}
          <Section title="Family Details">
            <TextInput name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's Name" />
            {errors.motherName && <p className="text-red-500 text-sm">{errors.motherName}</p>}
            <TextInput name="motherOccupation" value={form.motherOccupation} onChange={handleChange} placeholder="Mother's Occupation" />
            {errors.motherOccupation && <p className="text-red-500 text-sm">{errors.motherOccupation}</p>}
            <TextInput
              name="motherDateOfBirth"
              value={form.motherDateOfBirth}
              onChange={handleChange}
              placeholder="Mother's Date of Birth"
              type="date"
            />
            <TextInput name="motherAadhar" value={form.motherAadhar} onChange={handleChange} placeholder="Mother Aadhar Number" />
            {errors.motherAadhar && <p className="text-red-500 text-sm">{errors.motherAadhar}</p>}
            <TextInput name="wifeName" value={form.wifeName} onChange={handleChange} placeholder="Wife's Name" />
            {errors.wifeName && <p className="text-red-500 text-sm">{errors.wifeName}</p>}
            <TextInput name="wifeOccupation" value={form.wifeOccupation} onChange={handleChange} placeholder="Wife's Occupation" />
            {errors.wifeOccupation && <p className="text-red-500 text-sm">{errors.wifeOccupation}</p>}
            <TextInput
              name="wifeDateOfBirth"
              value={form.wifeDateOfBirth}
              onChange={handleChange}
              placeholder="Wife's Date of Birth"
              type="date"
            />

            <TextInput name="wifeAadhar" value={form.wifeAadhar} onChange={handleChange} placeholder="Wife Aadhar Number" />
            {errors.wifeAadhar && <p className="text-red-500 text-sm">{errors.wifeAadhar}</p>}
            <div className="col-span-2">
              <h4 className="font-semibold mb-2">Sons</h4>

              {form.sons.map((son, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <input
                    type="text"
                    placeholder="Son Name"
                    value={son.name}
                    onChange={(e) =>
                      handleChildChange("sons", index, "name", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <TextInput
                    type="date"
                    placeholder="Son's Date of Birth"
                    value={son.dateOfBirth}
                    onChange={(e) =>
                      handleChildChange("sons", index, "dateOfBirth", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    type="text"
                    placeholder="Son Aadhar Number"
                    value={son.aadhar}
                    onChange={(e) =>
                      handleChildChange("sons", index, "aadhar", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  {form.sons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild("sons", index)}
                      className="bg-red-500 text-white rounded px-3"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addChild("sons")}
                className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
              >
                + Add Son
              </button>
            </div>
<div className="col-span-2 mt-4">
  <h4 className="font-semibold mb-2">Daughters</h4>

  {form.daughters.map((daughter, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
      <input
        type="text"
        placeholder="Daughter Name"
        value={daughter.name}
        onChange={(e) =>
          handleChildChange("daughters", index, "name", e.target.value)
        }
        className="border p-2 rounded"
      />

      <TextInput
        type="date"
        placeholder="Daughter's Date of Birth"
        value={daughter.dateOfBirth}
        onChange={(e) =>
          handleChildChange("daughters", index, "dateOfBirth", e.target.value)
        }
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Daughter Aadhar Number"
        value={daughter.aadhar}
        onChange={(e) =>
          handleChildChange("daughters", index, "aadhar", e.target.value)
        }
        className="border p-2 rounded"
      />

      {form.daughters.length > 1 && (
        <button
          type="button"
          onClick={() => removeChild("daughters", index)}
          className="bg-red-500 text-white rounded px-3"
        >
          Remove
        </button>
      )}
    </div>
  ))}

  <button
    type="button"
    onClick={() => addChild("daughters")}
    className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
  >
    + Add Daughter
  </button>
</div>
</Section>

          {/* OTHER DETAILS */}
          <Section title="Other Details">
            <TextInput name="totalFee" value={form.totalFee} onChange={handleChange} placeholder="Total Fee" type="number" />
            {errors.totalFee && <p className="text-red-500 text-sm">{errors.totalFee}</p>}
            <TextInput name="paidAmount" value={form.paidAmount} onChange={handleChange} placeholder="Paid Amount" type="number" />
            {errors.paidAmount && <p className="text-red-500 text-sm">{errors.paidAmount}</p>}
            <TextInput name="balance" value={form.balance} onChange={handleChange} placeholder="Balance" type="number" readOnly />
            <TextInput name="appointmentUnit" value={form.appointmentUnit} onChange={handleChange} placeholder="Appointment Unit" />
            <MemoizedSelect name="post" value={form.post} onChange={handleChange} options={POST_OPTIONS} required />
          </Section>
            {/* ARMS GUARD EXTRA FIELDS */}
                                    {isArmsGuard && (
                                      <Section title="Arms Guard Details">
                                        <TextInput
                                          name="licenseNo"
                                          placeholder="Licence No"
                                          value={form.licenseNo}
                                          onChange={handleChange}
                                          required
                                        />
                                        {errors.licenseNo && <p className="text-red-500 text-sm">{errors.licenseNo}</p>}

                                        <TextInput
                                          name="validArea"
                                          placeholder="Valid Area"
                                          value={form.validArea}
                                          onChange={handleChange}
                                          required
                                        />
                                        {errors.validArea && <p className="text-red-500 text-sm">{errors.validArea}</p>}

                                        <TextInput
                                          type="date"
                                          name="renewalUpto"
                                          value={form.renewalUpto}
                                          onChange={handleChange}
                                          required
                                        />
                                        {errors.renewalUpto && <p className="text-red-500 text-sm">{errors.renewalUpto}</p>}
                                      </Section>
                                    )}


          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded w-full">
            Register Employee
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
