import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/admin/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch employee details");
        navigate("/dashboard");
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handlePrint = async () => {
    try {
      const res = await api.post("/pdf/employee", employee, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${employee.name}_details.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }
  };

  if (!employee) return <p className="p-6">Loading...</p>;

  const isArmsGuard = employee.post === "Arms Guard";

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
        {/* ACTIONS */}
        <div className="flex justify-between mb-6">
          <div>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600"
              onClick={() => navigate("/dashboard")}
            >
              Back
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => navigate(`/dashboard/edit/${id}`)}
            >
              Edit
            </button>
          </div>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>

        <div ref={printRef} className="text-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6">
            Employee Details
          </h2>

          {/* BASIC DETAILS */}
          <Section title="Basic Details">
            <Item label="Name" value={employee.name} />
            <Item label="Date Of Joining" value={employee.date} />
            <Item label="Mobile" value={employee.mobile} />
            <Item label="Father's Name" value={employee.fatherName} />
            <Item label="Date of Birth" value={employee.dateOfBirth} />
            <Item label="Father DOB" value={employee.fatherDateOfBirth} />
            <Item label="District" value={employee.district} />
            <Item label="Village" value={employee.village} />
            <Item label="Post Office" value={employee.po} />
            <Item label="Pin Code" value={employee.pinCode} />
            <Item label="Qualification" value={employee.qualification} />
            <Item
              label="Nearest Railway Station"
              value={employee.nearestRailwayStation}
            />
          </Section>

          {/* PHYSICAL DETAILS */}
          <Section title="Physical Details">
            <Item label="Chest" value={employee.chest} />
            <Item label="Waist" value={employee.waist} />
            <Item label="Pant Length" value={employee.pantLength} />
            <Item label="Weight" value={employee.weight} />
            <Item label="Height" value={employee.height} />
            <Item label="Blood Group" value={employee.bloodGroup} />
            <Item label="Identification Mark 1" value={employee.identificationMark1} />
            <Item label="Identification Mark 2" value={employee.identificationMark2} />
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            <Item label="Account Holder" value={employee.accountHolderName} />
            <Item label="Bank Name" value={employee.bankName} />
            <Item label="Branch" value={employee.branch} />
            <Item label="IFSC Code" value={employee.branchCode} />
            <Item label="Account No" value={employee.accountNo} />
          </Section>

          {/* PRESENT ADDRESS */}
          <Section title="Present Address">
            <Item label="C/O" value={employee.careOf} />
            <Item label="Mohalla" value={employee.moh} />
            <Item label="Phone/Mobile" value={employee.addressPhone} />
            <Item label="House No" value={employee.houseNo} />
            <Item label="Road No" value={employee.roadNo} />
            <Item label="PO" value={employee.presentPo} />
            <Item label="PS" value={employee.presentPs} />
            <Item label="District" value={employee.presentDistrict} />
            <Item label="State" value={employee.presentState} />
            <Item label="Pin Code" value={employee.presentPinCode} />
          </Section>

          {/* FAMILY DETAILS */}
          <Section title="Family Details">
            <Item label="Mother's Name" value={employee.motherName} />
            <Item label="Mother's Occupation" value={employee.motherOccupation} />
            <Item label="Mother DOB" value={employee.motherDateOfBirth} />
            <Item label="Wife's Name" value={employee.wifeName} />
            <Item label="Wife's Occupation" value={employee.wifeOccupation} />
            <Item label="Wife DOB" value={employee.wifeDateOfBirth} />

            <div className="col-span-2">
              <strong>Sons:</strong>
              <ul className="list-disc ml-6">
                {employee.sons?.length
                  ? employee.sons.map((s, i) => (
                      <li key={i}>
                        {s.name} (DOB: {s.dateOfBirth})
                      </li>
                    ))
                  : " N/A"}
              </ul>
            </div>

            <div className="col-span-2">
              <strong>Daughters:</strong>
              <ul className="list-disc ml-6">
                {employee.daughters?.length
                  ? employee.daughters.map((d, i) => (
                      <li key={i}>
                        {d.name} (DOB: {d.dateOfBirth})
                      </li>
                    ))
                  : " N/A"}
              </ul>
            </div>
          </Section>

          {/* OTHER DETAILS */}
          <Section title="Other Details">
            <Item label="Total Fee" value={employee.totalFee} />
            <Item label="Paid Amount" value={employee.paidAmount} />
            <Item label="Balance" value={employee.balance} />
            <Item label="Appointment Unit" value={employee.appointmentUnit} />
            <Item label="Post" value={employee.post} />
          </Section>
          {/* ARMS GUARD DETAILS */}
                    {isArmsGuard && (
                      <Section title="Arms Guard Details">
                        <Item label="Licence No" value={employee.licenseNo} />
                        <Item label="Valid Area" value={employee.validArea} />
                        <Item label="Renewal Upto" value={employee.renewalUpto} />
                      </Section>
                    )}
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL REUSABLE COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <section className="mb-6">
    <h3 className="font-semibold mb-2 border-b pb-1">{title}</h3>
    <div className="grid grid-cols-2 gap-2">{children}</div>
  </section>
);

const Item = ({ label, value }) => (
  <div>
    <strong>{label}:</strong> {value || "—"}
  </div>
);
