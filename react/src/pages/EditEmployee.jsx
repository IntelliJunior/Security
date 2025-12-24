// src/pages/EditEmployee.jsx
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
    sons: [],
    daughters: [],
    totalFee: "",
    paidAmount: "",
    balance: "",
    appointmentUnit: "",
    post: "",
    licenseNo: "",
    validArea: "",
    renewalUpto: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState("");
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
    try {
      await api.put(`/admin/employees/${id}`, form);
      setMessage("✅ Employee updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update employee");
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
            <MemoizedInput name="phoneNo" placeholder="Phone No" value={form.phoneNo} onChange={handleChange} />
            <MemoizedInput name="date" placeholder="Date" type="date" value={form.date} onChange={handleChange} />
            <MemoizedInput name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required={true} />
            <MemoizedInput name="mobile" placeholder="Mobile No" value={form.mobile} onChange={handleChange} required={true} />
            <MemoizedInput name="fatherName" placeholder="Father's Name" value={form.fatherName} onChange={handleChange} />
            <MemoizedInput name="fatherOccupation" placeholder="Father's Occupation" value={form.fatherOccupation} onChange={handleChange} />
            <MemoizedInput name="age" placeholder="Age" type="number" value={form.age} onChange={handleChange} />
            <MemoizedInput name="village" placeholder="Village" value={form.village} onChange={handleChange} />
            <MemoizedInput name="po" placeholder="Post Office" value={form.po} onChange={handleChange} />
            <MemoizedInput name="district" placeholder="District" value={form.district} onChange={handleChange} />
            <MemoizedInput name="pinCode" placeholder="Pin Code" value={form.pinCode} onChange={handleChange} />
            <MemoizedInput name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} />
            <MemoizedInput name="nearestRailwayStation" placeholder="Nearest Railway Station" value={form.nearestRailwayStation} onChange={handleChange} />
          </Section>

          {/* PHYSICAL DETAILS - NOW USING MemoizedInput */}
          <Section title="Physical Details">
            <MemoizedInput name="identificationMark1" placeholder="Identification Mark 1" value={form.identificationMark1} onChange={handleChange} />
            <MemoizedInput name="identificationMark2" placeholder="Identification Mark 2" value={form.identificationMark2} onChange={handleChange} />
            <MemoizedInput name="chest" placeholder="Chest" value={form.chest} onChange={handleChange} />
            <MemoizedInput name="waist" placeholder="Waist" value={form.waist} onChange={handleChange} />
            <MemoizedInput name="pantLength" placeholder="Pant Length" value={form.pantLength} onChange={handleChange} />
            <MemoizedInput name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} />
            <MemoizedInput name="height" placeholder="Height" value={form.height} onChange={handleChange} />
            <MemoizedInput name="bloodGroup" placeholder="Blood Group" value={form.bloodGroup} onChange={handleChange} />
          </Section>

          {/* BANK DETAILS - NOW USING MemoizedInput */}
          <Section title="Bank Details">
            <MemoizedInput name="accountHolderName" placeholder="Account Holder Name" value={form.accountHolderName} onChange={handleChange} />
            <MemoizedInput name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} />
            <MemoizedInput name="branchCode" placeholder="IFSC Code" value={form.branchCode} onChange={handleChange} />
            <MemoizedInput name="accountNo" placeholder="Account Number" value={form.accountNo} onChange={handleChange} />
            <MemoizedInput name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} />
          </Section>

          {/* PRESENT ADDRESS - NOW USING MemoizedInput */}
          <Section title="Present Address">
            <MemoizedInput name="careOf" placeholder="C/O" value={form.careOf} onChange={handleChange} />
            <MemoizedInput name="moh" placeholder="Mohalla" value={form.moh} onChange={handleChange} />
            <MemoizedInput name="addressPhone" placeholder="Phone/Mobile" value={form.addressPhone} onChange={handleChange} />
            <MemoizedInput name="houseNo" placeholder="House No" value={form.houseNo} onChange={handleChange} />
            <MemoizedInput name="roadNo" placeholder="Road No" value={form.roadNo} onChange={handleChange} />
            <MemoizedInput name="presentPo" placeholder="PO" value={form.presentPo} onChange={handleChange} />
            <MemoizedInput name="presentPs" placeholder="PS" value={form.presentPs} onChange={handleChange} />
            <MemoizedInput name="presentDistrict" placeholder="District" value={form.presentDistrict} onChange={handleChange} />
            <MemoizedInput name="presentState" placeholder="State" value={form.presentState} onChange={handleChange} />
            <MemoizedInput name="presentPinCode" placeholder="Pin Code" value={form.presentDistrict} onChange={handleChange} />
          </Section>

          {/* FAMILY DETAILS - NOW USING MemoizedInput */}
          <Section title="Family Details">
            <MemoizedInput name="motherName" placeholder="Mother's Name" value={form.motherName} onChange={handleChange} />
            <MemoizedInput name="motherOccupation" placeholder="Mother's Occupation" value={form.motherOccupation} onChange={handleChange} />
            <MemoizedInput type="date" name="motherDateOfBirth" value={form.motherDateOfBirth} onChange={handleChange} />
            <MemoizedInput name="wifeName" placeholder="Wife's Name" value={form.wifeName} onChange={handleChange} />
            <MemoizedInput name="wifeOccupation" placeholder="Wife's Occupation" value={form.wifeOccupation} onChange={handleChange} />
            <MemoizedInput type="date" name="wifeDateOfBirth" value={form.wifeDateOfBirth} onChange={handleChange} />
            {/* SONS */}
              <div className="col-span-2">
                <h4 className="font-semibold">Sons</h4>
                {form.sons.map((son, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <input className="border p-2" value={son.name}
                      onChange={e => handleChildChange("sons", i, "name", e.target.value)} />
                    <input type="date" className="border p-2"
                      value={son.dateOfBirth}
                      onChange={e => handleChildChange("sons", i, "dateOfBirth", e.target.value)} />
                    <button type="button" onClick={() => removeChild("sons", i)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addChild("sons")}>+ Add Son</button>
              </div>

              {/* DAUGHTERS */}
              <div className="col-span-2 mt-4">
                <h4 className="font-semibold">Daughters</h4>
                {form.daughters.map((d, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <input className="border p-2" value={d.name}
                      onChange={e => handleChildChange("daughters", i, "name", e.target.value)} />
                    <input type="date" className="border p-2"
                      value={d.dateOfBirth}
                      onChange={e => handleChildChange("daughters", i, "dateOfBirth", e.target.value)} />
                    <button type="button" onClick={() => removeChild("daughters", i)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addChild("daughters")}>+ Add Daughter</button>
              </div>
          </Section>

          {/* OTHER DETAILS - NOW USING MemoizedInput */}
          <Section title="Other Details">
            <MemoizedInput name="totalFee" placeholder="Total Fee" type="number" value={form.totalFee} onChange={handleChange} />
            <MemoizedInput name="paidAmount" placeholder="Paid Amount" type="number" value={form.paidAmount} onChange={handleChange} />
            <MemoizedInput name="balance" placeholder="Balance" type="number" value={form.balance} readOnly />
            <MemoizedInput name="appointmentUnit" placeholder="Appointment Unit" value={form.appointmentUnit} onChange={handleChange} />
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