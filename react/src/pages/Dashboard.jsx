// src/pages/Dashboard.jsx
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

  // Navigate to edit page
  const handleEdit = (id) => navigate(`/dashboard/edit/${id}`);

  // Navigate to view details page
  const handleView = (id) => navigate(`/dashboard/details/${id}`);

  // Navigate to register employee page
  const handleRegister = () => navigate("/dashboard/register");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Register Employee
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading employees...</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Registered Date</th>
                <th className="py-2 px-4 border">Mobile</th>
                <th className="py-2 px-4 border">Father Name</th>
                <th className="py-2 px-4 border">District</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id} className="text-center border-t">
                    <td className="py-2 px-4 border">{emp.name}</td>
                    <td className="py-2 px-4 border">{emp.date || "-"}</td>
                    <td className="py-2 px-4 border">{emp.mobile}</td>
                    <td className="py-2 px-4 border">{emp.fatherName}</td>
                    <td className="py-2 px-4 border">{emp.district}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => handleView(emp.id)}
                        className="bg-indigo-500 text-white py-1 px-3 rounded hover:bg-indigo-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(emp.id)}
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
