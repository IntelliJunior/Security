import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees", err);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/admin/employees/${id}`);
      fetchEmployees(); // refresh list after deletion
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  // Navigation actions
  const handleEdit = (id) => navigate(`/dashboard/edit/${id}`);
  const handleView = (id) => navigate(`/dashboard/details/${id}`);
  const handleRegister = () => navigate("/dashboard/register");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Admin Dashboard
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/dashboard/search")}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors shadow-sm"
            >
              Search Employee
            </button>
            <button
              onClick={handleRegister}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors shadow-sm"
            >
              Register Employee
            </button>
          </div>
        </div>

        {/* Employee Table */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">
            Loading employees...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="py-3 px-4 border text-left">Name</th>
                  <th className="py-3 px-4 border text-left">Registered Date</th>
                  <th className="py-3 px-4 border text-left">Mobile</th>
                  <th className="py-3 px-4 border text-left">Father Name</th>
                  <th className="py-3 px-4 border text-left">District</th>
                  <th className="py-3 px-4 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-4 border">{emp.name}</td>
                      <td className="py-2 px-4 border">{emp.date || "-"}</td>
                      <td className="py-2 px-4 border">{emp.mobile}</td>
                      <td className="py-2 px-4 border">{emp.fatherName}</td>
                      <td className="py-2 px-4 border">{emp.district}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(emp.id)}
                            className="bg-indigo-500 text-white py-1.5 px-3 rounded-md hover:bg-indigo-600 transition-colors shadow-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(emp.id)}
                            className="bg-blue-500 text-white py-1.5 px-3 rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="bg-red-500 text-white py-1.5 px-3 rounded-md hover:bg-red-600 transition-colors shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
