// src/pages/EditEmployee.jsx
import { toast } from "react-toastify";
import React, { useEffect, useState, memo } from "react"; // ⬅️ ADD React and memo import
import { useNavigate, useParams } from "react-router-dom";
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

// 1. EXTRACT AND MEMOIZE THE INPUT COMPONENT
const MemoizedInput = memo(
  ({ name, placeholder, type = "text", required = false, value, onChange }) => {
    // Ensure controlled input has a value (e.g., "" instead of null/undefined)
    const inputValue = value === null || value === undefined ? "" : value;

    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={onChange}
        className="border p-2 rounded"
        required={required}
        autoComplete="off"
      />
    );
  }
);

// 2. MOVE SECTION COMPONENT OUTSIDE
const Section = ({ title, children }) => (
  <div className="border p-4 rounded mb-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
  </div>
);


export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialFormState = {
      through: "",
      phoneNo: "",
      date: new Date().toISOString().split("T")[0],
      name: "",
      mobile: "",
      fatherName: "",
      fatherOccupation: "",
      fatherDateOfBirth: "",
      dateOfBirth: "",
      village: "",
      po: "",
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

  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState("");

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
        if (form[field] && form[field].trim().length > len) {
          e[field] = `${label} must be less than or equal to ${len} characters`;
        }
      };



      // Basic details
      maxLen("through", "Through", 30);
      maxLen("phoneNo", "Phone No", 22);
      maxLen("name", "Name", 50);
      maxLen("mobile", "Mobile", 55);
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

  const isArmsGuard = form.post === "Arms Guard";

  // Fetch employee data by ID
  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/admin/employees/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching employee", err);
      setMessage("❌ Failed to fetch employee data");
    }
  };

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);






  const handleChildChange = (type, index, field, value) => {
    setForm(prev => {
      const updated = [...prev[type]];
      updated[index][field] = value;
      return { ...prev, [type]: updated };
    });
  };

  const addChild = (type) => {
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], { name: "", dateOfBirth: "" }]
    }));
  };

  const removeChild = (type, index) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
         toast.error("Please fix form errors");
         return;
    }
    try {
      await api.put(`/admin/employees/${id}`, form);
      toast.success("✅ Employee updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update employee");
    }
  };

  // ❌ REMOVE THE renderInput FUNCTION
  /*
  const Section = ({ title, children }) => ( ... );
  const renderInput = (name, placeholder, type = "text", required = false) => ( ... );
  */


  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Edit Employee
        </h2>

        <form onSubmit={handleSubmit}>
          {/* BASIC DETAILS - NOW USING MemoizedInput */}
          <Section title="Basic Details">
            <MemoizedInput name="through" placeholder="Through" value={form.through} onChange={handleChange} />
            {errors.through && <p className="text-red-500 text-sm">{errors.through}</p>}
            <MemoizedInput name="phoneNo" placeholder="Phone No" value={form.phoneNo} onChange={handleChange} />
            {errors.phoneNo && <p className="text-red-500 text-sm">{errors.phoneNo}</p>}
            <MemoizedInput name="date" placeholder="Date" type="date" value={form.date} onChange={handleChange} />
            <MemoizedInput name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required={true} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <MemoizedInput name="mobile" placeholder="Mobile No" value={form.mobile} onChange={handleChange} required={true} />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            <MemoizedInput
                                      name="dateOfBirth"
                                      value={form.dateOfBirth}
                                      onChange={handleChange}
                                      placeholder="Employee Date of Birth"
                                      type="date"
                                      required
                                    />

                                    <MemoizedInput
                                        name="employeeAadhar"
                                        value={form.employeeAadhar}
                                        onChange={handleChange}
                                        placeholder="Employee Aadhar Number"
                                      />
                                      {errors.employeeAadhar && <p className="text-red-500 text-sm">{errors.employeeAadhar}</p>}
                                      <MemoizedInput
                                        name="employeeUan"
                                        value={form.employeeUan}
                                        onChange={handleChange}
                                        placeholder="Employee UAN Number"
                                      />
                                      {errors.employeeUan && <p className="text-red-500 text-sm">{errors.employeeUan}</p>}
                                      <MemoizedInput
                                        name="employeeInsuranceNo"
                                        value={form.employeeInsuranceNo}
                                        onChange={handleChange}
                                        placeholder="Employee Insurance Number"
                                      />
                                      {errors.employeeInsuranceNo && <p className="text-red-500 text-sm">{errors.employeeInsuranceNo}</p>}
                                      <MemoizedInput
                                        name="employeePfNo"
                                        value={form.employeePfNo}
                                        onChange={handleChange}
                                        placeholder="Employee PF Number"
                                      />
                                      {errors.employeePfNo && <p className="text-red-500 text-sm">{errors.employeePfNo}</p>}
            <MemoizedInput name="fatherName" placeholder="Father's Name" value={form.fatherName} onChange={handleChange} />
            {errors.fatherName && <p className="text-red-500 text-sm">{errors.fatherName}</p>}
            <MemoizedInput name="fatherOccupation" placeholder="Father's Occupation" value={form.fatherOccupation} onChange={handleChange} />
            {errors.fatherOccupation && <p className="text-red-500 text-sm">{errors.fatherOccupation}</p>}
            <MemoizedInput name="fatherDateOfBirth" placeholder="Father DOB" type="date" value={form.fatherDateOfBirth} onChange={handleChange} />
            <MemoizedInput
                                      name="fatherAadhar"
                                      value={form.fatherAadhar}
                                      onChange={handleChange}
                                      placeholder="Father Aadhar Number"
                        />
                        {errors.fatherAadhar && <p className="text-red-500 text-sm">{errors.fatherAadhar}</p>}
            <MemoizedInput name="village" placeholder="Village" value={form.village} onChange={handleChange} />
            {errors.village && <p className="text-red-500 text-sm">{errors.village}</p>}
            <MemoizedInput name="po" placeholder="Post Office" value={form.po} onChange={handleChange} />
            {errors.po && <p className="text-red-500 text-sm">{errors.po}</p>}
            <MemoizedInput name="district" placeholder="District" value={form.district} onChange={handleChange} />
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            <MemoizedInput name="pinCode" placeholder="Pin Code" value={form.pinCode} onChange={handleChange} />
            {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
            <MemoizedInput name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} />
            {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification}</p>}
            <MemoizedInput name="nearestRailwayStation" placeholder="Nearest Railway Station" value={form.nearestRailwayStation} onChange={handleChange} />
            {errors.nearestRailwayStation && <p className="text-red-500 text-sm">{errors.nearestRailwayStation}</p>}
          </Section>

          {/* PHYSICAL DETAILS - NOW USING MemoizedInput */}
          <Section title="Physical Details">
            <MemoizedInput name="identificationMark1" placeholder="Identification Mark 1" value={form.identificationMark1} onChange={handleChange} />
            {errors.identificationMark1 && <p className="text-red-500 text-sm">{errors.identificationMark1}</p>}
            <MemoizedInput name="identificationMark2" placeholder="Identification Mark 2" value={form.identificationMark2} onChange={handleChange} />
            {errors.identificationMark2 && <p className="text-red-500 text-sm">{errors.identificationMark2}</p>}
            <MemoizedInput name="chest" placeholder="Chest" value={form.chest} onChange={handleChange} />
            {errors.chest && <p className="text-red-500 text-sm">{errors.chest}</p>}
            <MemoizedInput name="waist" placeholder="Waist" value={form.waist} onChange={handleChange} />
            {errors.waist && <p className="text-red-500 text-sm">{errors.waist}</p>}
            <MemoizedInput name="pantLength" placeholder="Pant Length" value={form.pantLength} onChange={handleChange} />
            {errors.pantLength && <p className="text-red-500 text-sm">{errors.pantLength}</p>}
            <MemoizedInput name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
            <MemoizedInput name="height" placeholder="Height" value={form.height} onChange={handleChange} />
            {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
            <MemoizedInput name="bloodGroup" placeholder="Blood Group" value={form.bloodGroup} onChange={handleChange} />
            {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup}</p>}
          </Section>

          {/* BANK DETAILS - NOW USING MemoizedInput */}
          <Section title="Bank Details">
            <MemoizedInput name="accountHolderName" placeholder="Account Holder Name" value={form.accountHolderName} onChange={handleChange} />
            {errors.accountHolderName && <p className="text-red-500 text-sm">{errors.accountHolderName}</p>}
            <MemoizedInput name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} />
            {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
            <MemoizedInput name="branchCode" placeholder="IFSC Code" value={form.branchCode} onChange={handleChange} />
            {errors.branchCode && <p className="text-red-500 text-sm">{errors.branchCode}</p>}
            <MemoizedInput name="accountNo" placeholder="Account Number" value={form.accountNo} onChange={handleChange} />
            {errors.accountNo && <p className="text-red-500 text-sm">{errors.accountNo}</p>}
            <MemoizedInput name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} />
            {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}
          </Section>

          {/* PRESENT ADDRESS - NOW USING MemoizedInput */}
          <Section title="Present Address">
            <MemoizedInput name="careOf" placeholder="C/O" value={form.careOf} onChange={handleChange} />
            {errors.careOf && <p className="text-red-500 text-sm">{errors.careOf}</p>}
            <MemoizedInput name="moh" placeholder="Mohalla" value={form.moh} onChange={handleChange} />
            {errors.moh && <p className="text-red-500 text-sm">{errors.moh}</p>}
            <MemoizedInput name="addressPhone" placeholder="Phone/Mobile" value={form.addressPhone} onChange={handleChange} />
            {errors.addressPhone && <p className="text-red-500 text-sm">{errors.addressPhone}</p>}
            <MemoizedInput name="houseNo" placeholder="House No" value={form.houseNo} onChange={handleChange} />
            {errors.houseNo && <p className="text-red-500 text-sm">{errors.houseNo}</p>}
            <MemoizedInput name="roadNo" placeholder="Road No" value={form.roadNo} onChange={handleChange} />
            {errors.roadNo && <p className="text-red-500 text-sm">{errors.roadNo}</p>}
            <MemoizedInput name="presentPo" placeholder="PO" value={form.presentPo} onChange={handleChange} />
            {errors.presentPo && <p className="text-red-500 text-sm">{errors.presentPo}</p>}
            <MemoizedInput name="presentPs" placeholder="PS" value={form.presentPs} onChange={handleChange} />
            {errors.presentPs && <p className="text-red-500 text-sm">{errors.presentPs}</p>}
            <MemoizedInput name="presentDistrict" placeholder="District" value={form.presentDistrict} onChange={handleChange} />
            {errors.presentDistrict && <p className="text-red-500 text-sm">{errors.presentDistrict}</p>}
            <MemoizedInput name="presentState" placeholder="State" value={form.presentState} onChange={handleChange} />
            {errors.presentState && <p className="text-red-500 text-sm">{errors.presentState}</p>}
            <MemoizedInput name="presentPinCode" placeholder="Pin Code" value={form.presentPinCode} onChange={handleChange} />
            {errors.presentPinCode && <p className="text-red-500 text-sm">{errors.presentPinCode}</p>}
          </Section>

          {/* FAMILY DETAILS - NOW USING MemoizedInput */}
          {/* FAMILY DETAILS */}
          <Section title="Family Details">
            <MemoizedInput
              name="motherName"
              placeholder="Mother's Name"
              value={form.motherName}
              onChange={handleChange}
            />
            {errors.motherName && <p className="text-red-500 text-sm">{errors.motherName}</p>}
            <MemoizedInput
              name="motherOccupation"
              placeholder="Mother's Occupation"
              value={form.motherOccupation}
              onChange={handleChange}
            />
            {errors.motherOccupation && <p className="text-red-500 text-sm">{errors.motherOccupation}</p>}
            <MemoizedInput
              type="date"
              name="motherDateOfBirth"
              value={form.motherDateOfBirth}
              onChange={handleChange}
            />
            <MemoizedInput
                          name="motherAadhar"
                          value={form.motherAadhar}
                          onChange={handleChange}
                          placeholder="Mother Aadhar Number"
                        />
            {errors.motherAadhar && <p className="text-red-500 text-sm">{errors.motherAadhar}</p>}
            <MemoizedInput
              name="wifeName"
              placeholder="Wife's Name"
              value={form.wifeName}
              onChange={handleChange}
            />
            {errors.wifeName && <p className="text-red-500 text-sm">{errors.wifeName}</p>}
            <MemoizedInput
              name="wifeOccupation"
              placeholder="Wife's Occupation"
              value={form.wifeOccupation}
              onChange={handleChange}
            />
            {errors.wifeOccupation && <p className="text-red-500 text-sm">{errors.wifeOccupation}</p>}
            <MemoizedInput
              type="date"
              name="wifeDateOfBirth"
              value={form.wifeDateOfBirth}
              onChange={handleChange}
            />
            <MemoizedInput
                          name="wifeAadhar"
                          value={form.wifeAadhar}
                          onChange={handleChange}
                          placeholder="Wife Aadhar Number"
                        />
            {errors.wifeAadhar && <p className="text-red-500 text-sm">{errors.wifeAadhar}</p>}
            {/* SONS */}
            <div className="col-span-2">
              <h4 className="font-semibold text-gray-800">Sons</h4>

              {form.sons.map((son, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    className="border p-2 text-black"
                    value={son.name}
                    onChange={(e) =>
                      handleChildChange("sons", i, "name", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="border p-2 text-black"
                    value={son.dateOfBirth}
                    onChange={(e) =>
                      handleChildChange("sons", i, "dateOfBirth", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Son Aadhar Number"
                    value={son.aadhar || ""}
                    onChange={(e) =>
                      handleChildChange("sons", i, "aadhar", e.target.value)
                    }
                    className="border p-2 rounded"
                  />
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeChild("sons", i)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="text-blue-600 mt-2"
                onClick={() => addChild("sons")}
              >
                + Add Son
              </button>
            </div>

            {/* DAUGHTERS */}
            <div className="col-span-2 mt-4">
              <h4 className="font-semibold text-gray-800">Daughters</h4>

              {form.daughters.map((daughter, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    className="border p-2 text-black"
                    value={daughter.name}
                    onChange={(e) =>
                      handleChildChange("daughters", i, "name", e.target.value)
                    }
                  />

                  <input
                    type="date"
                    className="border p-2 text-black"
                    value={daughter.dateOfBirth}
                    onChange={(e) =>
                      handleChildChange("daughters", i, "dateOfBirth", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Daughter Aadhar Number"
                    value={daughter.aadhar || ""}
                    onChange={(e) =>
                      handleChildChange("daughters", i, "aadhar", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeChild("daughters", i)}
                  >
                    Remove
                  </button>
                </div>
              ))}


              <button
                type="button"
                className="text-blue-600 mt-2"
                onClick={() => addChild("daughters")}
              >
                + Add Daughter
              </button>
            </div>
          </Section>



          {/* OTHER DETAILS - NOW USING MemoizedInput */}
          <Section title="Other Details">
            <MemoizedInput name="totalFee" placeholder="Total Fee" type="number" value={form.totalFee} onChange={handleChange} />
            {errors.totalFee && <p className="text-red-500 text-sm">{errors.totalFee}</p>}
            <MemoizedInput name="paidAmount" placeholder="Paid Amount" type="number" value={form.paidAmount} onChange={handleChange} />
            {errors.paidAmount && <p className="text-red-500 text-sm">{errors.paidAmount}</p>}
            <MemoizedInput name="balance" placeholder="Balance" type="number" value={form.balance} readOnly />
            {errors.balance && <p className="text-red-500 text-sm">{errors.balance}</p>}
            <MemoizedInput name="appointmentUnit" placeholder="Appointment Unit" value={form.appointmentUnit} onChange={handleChange} />
            {errors.appointmentUnit && <p className="text-red-500 text-sm">{errors.appointmentUnit}</p>}
            <MemoizedSelect name="post" value={form.post} onChange={handleChange} options={POST_OPTIONS} required />
            {errors.post && <p className="text-red-500 text-sm">{errors.post}</p>}
          </Section>
            {/* ARMS GUARD EXTRA FIELDS */}
                        {isArmsGuard && (
                          <Section title="Arms Guard Details">
                            <MemoizedInput name="licenseNo" placeholder="Licence No" value={form.licenseNo} onChange={handleChange} required />
                            {errors.licenseNo && <p className="text-red-500 text-sm">{errors.licenseNo}</p>}
                            <MemoizedInput name="validArea" placeholder="Valid Area" value={form.validArea} onChange={handleChange} required />
                            {errors.validArea && <p className="text-red-500 text-sm">{errors.validArea}</p>}
                            <MemoizedInput type="date" name="renewalUpto" placeholder="Renewal Upto" value={form.renewalUpto} onChange={handleChange} required />
                            {errors.renewalUpto && <p className="text-red-500 text-sm">{errors.renewalUpto}</p>}
                          </Section>
                        )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded w-full"
          >
            Update Employee
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}