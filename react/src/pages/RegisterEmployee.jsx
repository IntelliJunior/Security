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

    try {
      const formData = new FormData();

      // Append JSON as a Blob
      formData.append(
        "employee",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );

      // Append file if selected
      if (photo) {
        formData.append("photo", photo);
      }

      await api.post("/admin/employees/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      setMessage("✅ Employee registered successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to register employee");
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
            <TextInput name="phoneNo" value={form.phoneNo} onChange={handleChange} placeholder="Phone No" />
            <TextInput name="date" value={form.date} onChange={handleChange} placeholder="Date" type="date" />
            <TextInput name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
            <TextInput name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile No" required />
            <TextInput
                          name="dateOfBirth"
                          value={form.dateOfBirth}
                          onChange={handleChange}
                          placeholder="Employee Date of Birth"
                          type="date"
                          required
                        />

                        <TextInput
                            name="employeeAadhar"
                            value={form.employeeAadhar}
                            onChange={handleChange}
                            placeholder="Employee Aadhar Number"
                          />
                          <TextInput
                            name="employeeUan"
                            value={form.employeeUan}
                            onChange={handleChange}
                            placeholder="Employee UAN Number"
                          />
                          <TextInput
                            name="employeeInsuranceNo"
                            value={form.employeeInsuranceNo}
                            onChange={handleChange}
                            placeholder="Employee Insurance Number"
                          />
                          <TextInput
                            name="employeePfNo"
                            value={form.employeePfNo}
                            onChange={handleChange}
                            placeholder="Employee PF Number"
                          />
            <TextInput name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's Name" />
            <TextInput name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} placeholder="Father's Occupation" />
            <TextInput
              name="fatherDateOfBirth"
              value={form.fatherDateOfBirth}
              onChange={handleChange}
              placeholder="Father's Date of Birth"
              type="date"
            />
            <TextInput
                          name="fatherAadhar"
                          value={form.fatherAadhar}
                          onChange={handleChange}
                          placeholder="Father Aadhar Number"
            />
            <TextInput name="village" value={form.village} onChange={handleChange} placeholder="Village" />
            <TextInput name="po" value={form.po} onChange={handleChange} placeholder="Post Office" />
            <TextInput name="district" value={form.district} onChange={handleChange} placeholder="District" />
            <TextInput name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="Pin Code" />
            <TextInput name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" />
            <TextInput name="nearestRailwayStation" value={form.nearestRailwayStation} onChange={handleChange} placeholder="Nearest Railway Station" />
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
            <TextInput name="identificationMark2" value={form.identificationMark2} onChange={handleChange} placeholder="Identification Mark 2" />
            <TextInput name="chest" value={form.chest} onChange={handleChange} placeholder="Chest" />
            <TextInput name="waist" value={form.waist} onChange={handleChange} placeholder="Waist" />
            <TextInput name="pantLength" value={form.pantLength} onChange={handleChange} placeholder="Pant Length" />
            <TextInput name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" />
            <TextInput name="height" value={form.height} onChange={handleChange} placeholder="Height" />
            <TextInput name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="Blood Group" />
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            <TextInput name="accountHolderName" value={form.accountHolderName} onChange={handleChange} placeholder="Account Holder Name" />
            <TextInput name="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" />
            <TextInput name="branchCode" value={form.branchCode} onChange={handleChange} placeholder="IFSC Code" />
            <TextInput name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="Account Number" />
            <TextInput name="branch" value={form.branch} onChange={handleChange} placeholder="Branch" />
          </Section>

          {/* PRESENT ADDRESS */}
          <Section title="Present Address">
            <TextInput name="careOf" value={form.careOf} onChange={handleChange} placeholder="C/O" />
            <TextInput name="moh" value={form.moh} onChange={handleChange} placeholder="Mohalla" />
            <TextInput name="addressPhone" value={form.addressPhone} onChange={handleChange} placeholder="Phone/Mobile" />
            <TextInput name="houseNo" value={form.houseNo} onChange={handleChange} placeholder="House No" />
            <TextInput name="roadNo" value={form.roadNo} onChange={handleChange} placeholder="Road No" />
            <TextInput name="presentPo" value={form.presentPo} onChange={handleChange} placeholder="PO" />
            <TextInput name="presentPs" value={form.presentPs} onChange={handleChange} placeholder="PS" />
            <TextInput name="presentDistrict" value={form.presentDistrict} onChange={handleChange} placeholder="District" />
            <TextInput name="presentState" value={form.presentState} onChange={handleChange} placeholder="State" />
            <TextInput name="presentPinCode" value={form.presentPinCode} onChange={handleChange} placeholder="Pin Code" />
          </Section>

          {/* FAMILY DETAILS */}
          <Section title="Family Details">
            <TextInput name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's Name" />
            <TextInput name="motherOccupation" value={form.motherOccupation} onChange={handleChange} placeholder="Mother's Occupation" />
            <TextInput
              name="motherDateOfBirth"
              value={form.motherDateOfBirth}
              onChange={handleChange}
              placeholder="Mother's Date of Birth"
              type="date"
            />
            <TextInput
              name="motherAadhar"
              value={form.motherAadhar}
              onChange={handleChange}
              placeholder="Mother Aadhar Number"
            />
            <TextInput name="wifeName" value={form.wifeName} onChange={handleChange} placeholder="Wife's Name" />
            <TextInput name="wifeOccupation" value={form.wifeOccupation} onChange={handleChange} placeholder="Wife's Occupation" />
            <TextInput
              name="wifeDateOfBirth"
              value={form.wifeDateOfBirth}
              onChange={handleChange}
              placeholder="Wife's Date of Birth"
              type="date"
            />

            <TextInput
              name="wifeAadhar"
              value={form.wifeAadhar}
              onChange={handleChange}
              placeholder="Wife Aadhar Number"
            />
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
            <TextInput name="paidAmount" value={form.paidAmount} onChange={handleChange} placeholder="Paid Amount" type="number" />
            <TextInput name="balance" value={form.balance} onChange={handleChange} placeholder="Balance" type="number" readOnly />
            <TextInput name="appointmentUnit" value={form.appointmentUnit} onChange={handleChange} placeholder="Appointment Unit" />
            <MemoizedSelect name="post" value={form.post} onChange={handleChange} options={POST_OPTIONS} required />
          </Section>
            {/* ARMS GUARD EXTRA FIELDS */}
                                    {isArmsGuard && (
                                      <Section title="Arms Guard Details">
                                        <MemoizedInput name="licenseNo" placeholder="Licence No" value={form.licenseNo} onChange={handleChange} required />
                                        <MemoizedInput name="validArea" placeholder="Valid Area" value={form.validArea} onChange={handleChange} required />
                                        <MemoizedInput type="date" name="renewalUpto" placeholder="Renewal Upto" value={form.renewalUpto} onChange={handleChange} required />
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
