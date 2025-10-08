// src/pages/EditEmployee.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

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
    age: "",
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
    motherName: "",
    motherOccupation: "",
    motherAge: "",
    wifeName: "",
    wifeOccupation: "",
    wifeAge: "",
    sons: "",
    daughters: "",
    totalFee: "",
    paidAmount: "",
    balance: "",
    appointmentUnit: "",
    post: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState("");

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
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const Section = ({ title, children }) => (
    <div className="border p-4 rounded mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );

  const renderInput = (name, placeholder, type = "text", required = false) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={form[name]}
      onChange={handleChange}
      className="border p-2 rounded"
      required={required}
      autoComplete="off"
    />
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Edit Employee
        </h2>

        <form onSubmit={handleSubmit}>
          {/* BASIC DETAILS */}
          <Section title="Basic Details">
            {renderInput("through", "Through")}
            {renderInput("phoneNo", "Phone No")}
            {renderInput("date", "Date", "date")}
            {renderInput("name", "Full Name", "text", true)}
            {renderInput("mobile", "Mobile No", "text", true)}
            {renderInput("fatherName", "Father's Name")}
            {renderInput("fatherOccupation", "Father's Occupation")}
            {renderInput("age", "Age", "number")}
            {renderInput("village", "Village")}
            {renderInput("po", "Post Office")}
            {renderInput("block", "Block")}
            {renderInput("subdivision", "Subdivision")}
            {renderInput("district", "District")}
            {renderInput("pinCode", "Pin Code")}
            {renderInput("qualification", "Qualification")}
            {renderInput("nearestRailwayStation", "Nearest Railway Station")}
          </Section>

          {/* PHYSICAL DETAILS */}
          <Section title="Physical Details">
            {renderInput("identificationMark1", "Identification Mark 1")}
            {renderInput("identificationMark2", "Identification Mark 2")}
            {renderInput("chest", "Chest")}
            {renderInput("waist", "Waist")}
            {renderInput("pantLength", "Pant Length")}
            {renderInput("weight", "Weight")}
            {renderInput("height", "Height")}
            {renderInput("bloodGroup", "Blood Group")}
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            {renderInput("accountHolderName", "Account Holder Name")}
            {renderInput("bankName", "Bank Name")}
            {renderInput("branchCode", "Branch Code")}
            {renderInput("accountNo", "Account Number")}
            {renderInput("branch", "Branch")}
          </Section>

          {/* PRESENT ADDRESS */}
          <Section title="Present Address">
            {renderInput("careOf", "Care Of")}
            {renderInput("moh", "Mohalla")}
            {renderInput("addressPhone", "Address Phone")}
            {renderInput("houseNo", "House No")}
            {renderInput("roadNo", "Road No")}
            {renderInput("wardNo", "Ward No")}
            {renderInput("presentPo", "Present PO")}
            {renderInput("presentPs", "Present PS")}
            {renderInput("presentDistrict", "Present District")}
          </Section>

          {/* FAMILY DETAILS */}
          <Section title="Family Details">
            {renderInput("motherName", "Mother's Name")}
            {renderInput("motherOccupation", "Mother's Occupation")}
            {renderInput("motherAge", "Mother's Age")}
            {renderInput("wifeName", "Wife's Name")}
            {renderInput("wifeOccupation", "Wife's Occupation")}
            {renderInput("wifeAge", "Wife's Age")}
            {renderInput("sons", "Sons (comma-separated)")}
            {renderInput("daughters", "Daughters (comma-separated)")}
          </Section>

          {/* OTHER DETAILS */}
          <Section title="Other Details">
            {renderInput("totalFee", "Total Fee")}
            {renderInput("paidAmount", "Paid Amount")}
            {renderInput("balance", "Balance")}
            {renderInput("appointmentUnit", "Appointment Unit")}
            {renderInput("post", "Post")}
          </Section>

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
