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
      const res = await api.post("/pdf/employee", employee, { responseType: "blob" });
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


  if (!employee) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-5xl">
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
          <h2 className="text-2xl font-bold text-center mb-6">Employee Details</h2>

          {/* BASIC DETAILS */}
          <section className="mb-6">
            <h3 className="font-semibold mb-2 border-b pb-1">Basic Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Name:</strong> {employee.name}</div>
              <div><strong>Mobile:</strong> {employee.mobile}</div>
              <div><strong>Father's Name:</strong> {employee.fatherName}</div>
              <div><strong>Age:</strong> {employee.age}</div>
              <div><strong>District:</strong> {employee.district}</div>
              <div><strong>Village:</strong> {employee.village}</div>
              <div><strong>Post Office:</strong> {employee.po}</div>
              <div><strong>Block:</strong> {employee.block}</div>
              <div><strong>Subdivision:</strong> {employee.subdivision}</div>
              <div><strong>Pin Code:</strong> {employee.pinCode}</div>
              <div><strong>Qualification:</strong> {employee.qualification}</div>
              <div><strong>Nearest Railway Station:</strong> {employee.nearestRailwayStation}</div>
            </div>
          </section>

          {/* PHYSICAL DETAILS */}
          <section className="mb-6">
            <h3 className="font-semibold mb-2 border-b pb-1">Physical Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Chest:</strong> {employee.chest}</div>
              <div><strong>Waist:</strong> {employee.waist}</div>
              <div><strong>Pant Length:</strong> {employee.pantLength}</div>
              <div><strong>Weight:</strong> {employee.weight}</div>
              <div><strong>Height:</strong> {employee.height}</div>
              <div><strong>Blood Group:</strong> {employee.bloodGroup}</div>
              <div><strong>Identification Mark 1:</strong> {employee.identificationMark1}</div>
              <div><strong>Identification Mark 2:</strong> {employee.identificationMark2}</div>
            </div>
          </section>

          {/* BANK DETAILS */}
          <section className="mb-6">
            <h3 className="font-semibold mb-2 border-b pb-1">Bank Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Account Holder:</strong> {employee.accountHolderName}</div>
              <div><strong>Bank Name:</strong> {employee.bankName}</div>
              <div><strong>Branch:</strong> {employee.branch}</div>
              <div><strong>Branch Code:</strong> {employee.branchCode}</div>
              <div><strong>Account No:</strong> {employee.accountNo}</div>
            </div>
          </section>

          {/* FAMILY DETAILS */}
          <section className="mb-6">
            <h3 className="font-semibold mb-2 border-b pb-1">Family Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Mother's Name:</strong> {employee.motherName}</div>
              <div><strong>Mother's Occupation:</strong> {employee.motherOccupation}</div>
              <div><strong>Mother's Age:</strong> {employee.motherAge}</div>
              <div><strong>Wife's Name:</strong> {employee.wifeName}</div>
              <div><strong>Wife's Occupation:</strong> {employee.wifeOccupation}</div>
              <div><strong>Wife's Age:</strong> {employee.wifeAge}</div>
              <div><strong>Sons:</strong> {employee.sons}</div>
              <div><strong>Daughters:</strong> {employee.daughters}</div>
            </div>
          </section>

          {/* OTHER DETAILS */}
          <section>
            <h3 className="font-semibold mb-2 border-b pb-1">Other Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Total Fee:</strong> {employee.totalFee}</div>
              <div><strong>Paid Amount:</strong> {employee.paidAmount}</div>
              <div><strong>Balance:</strong> {employee.balance}</div>
              <div><strong>Appointment Unit:</strong> {employee.appointmentUnit}</div>
              <div><strong>Post:</strong> {employee.post}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
