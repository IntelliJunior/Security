import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// Memoized input to prevent unnecessary re-renders
const TextInput = ({ name, value, onChange, placeholder, type = "text", required = false }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 rounded w-full"
      required={required}
      autoComplete="off"
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

export default function RegisterEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
            <TextInput name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's Name" />
            <TextInput name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} placeholder="Father's Occupation" />
            <TextInput name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" />
            <TextInput name="village" value={form.village} onChange={handleChange} placeholder="Village" />
            <TextInput name="po" value={form.po} onChange={handleChange} placeholder="Post Office" />
            <TextInput name="block" value={form.block} onChange={handleChange} placeholder="Block" />
            <TextInput name="subdivision" value={form.subdivision} onChange={handleChange} placeholder="Subdivision" />
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
            <TextInput name="branchCode" value={form.branchCode} onChange={handleChange} placeholder="Branch Code" />
            <TextInput name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="Account Number" />
            <TextInput name="branch" value={form.branch} onChange={handleChange} placeholder="Branch" />
          </Section>

          {/* PRESENT ADDRESS */}
          <Section title="Present Address">
            <TextInput name="careOf" value={form.careOf} onChange={handleChange} placeholder="Care Of" />
            <TextInput name="moh" value={form.moh} onChange={handleChange} placeholder="Mohalla" />
            <TextInput name="addressPhone" value={form.addressPhone} onChange={handleChange} placeholder="Address Phone" />
            <TextInput name="houseNo" value={form.houseNo} onChange={handleChange} placeholder="House No" />
            <TextInput name="roadNo" value={form.roadNo} onChange={handleChange} placeholder="Road No" />
            <TextInput name="wardNo" value={form.wardNo} onChange={handleChange} placeholder="Ward No" />
            <TextInput name="presentPo" value={form.presentPo} onChange={handleChange} placeholder="Present PO" />
            <TextInput name="presentPs" value={form.presentPs} onChange={handleChange} placeholder="Present PS" />
            <TextInput name="presentDistrict" value={form.presentDistrict} onChange={handleChange} placeholder="Present District" />
          </Section>

          {/* FAMILY DETAILS */}
          <Section title="Family Details">
            <TextInput name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's Name" />
            <TextInput name="motherOccupation" value={form.motherOccupation} onChange={handleChange} placeholder="Mother's Occupation" />
            <TextInput name="motherAge" value={form.motherAge} onChange={handleChange} placeholder="Mother's Age" />
            <TextInput name="wifeName" value={form.wifeName} onChange={handleChange} placeholder="Wife's Name" />
            <TextInput name="wifeOccupation" value={form.wifeOccupation} onChange={handleChange} placeholder="Wife's Occupation" />
            <TextInput name="wifeAge" value={form.wifeAge} onChange={handleChange} placeholder="Wife's Age" />
            <TextInput name="sons" value={form.sons} onChange={handleChange} placeholder="Sons (comma-separated)" />
            <TextInput name="daughters" value={form.daughters} onChange={handleChange} placeholder="Daughters (comma-separated)" />
          </Section>

          {/* OTHER DETAILS */}
          <Section title="Other Details">
            <TextInput name="totalFee" value={form.totalFee} onChange={handleChange} placeholder="Total Fee" />
            <TextInput name="paidAmount" value={form.paidAmount} onChange={handleChange} placeholder="Paid Amount" />
            <TextInput name="balance" value={form.balance} onChange={handleChange} placeholder="Balance" />
            <TextInput name="appointmentUnit" value={form.appointmentUnit} onChange={handleChange} placeholder="Appointment Unit" />
            <TextInput name="post" value={form.post} onChange={handleChange} placeholder="Post" />
          </Section>

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
