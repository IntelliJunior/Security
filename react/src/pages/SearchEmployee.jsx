import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SearchEmployee() {
  const [criteria, setCriteria] = useState("name");
  const [value, setValue] = useState("");
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!value.trim()) {
      setMessage("Please enter a search value.");
      return;
    }

    try {
      const res = await api.get(`/admin/employees/search?${criteria}=${value}`);
      setEmployees(res.data);
      if (res.data.length === 0) setMessage("No employees found.");
      else setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error searching employees.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Search Employee</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-3 mb-4">
          <select
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="name">Name</option>
            <option value="mobile">Mobile</option>
            <option value="fatherName">Father Name</option>
            <option value="village">Village</option>
            <option value="district">District</option>
            <option value="through">Reference</option>
          </select>

          <input
            type="text"
            placeholder={`Enter ${criteria}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded flex-1"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {message && <p className="mb-4 text-center text-red-500">{message}</p>}

        {employees.length > 0 && (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Mobile</th>
                <th className="py-2 px-4 border">Father Name</th>
                <th className="py-2 px-4 border">district</th>
                <th className="py-2 px-4 border">village</th>
                <th className="py-2 px-4 border">through</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="text-center border-t">
                  <td className="py-2 px-4 border">{emp.name}</td>
                  <td className="py-2 px-4 border">{emp.mobile}</td>
                  <td className="py-2 px-4 border">{emp.fatherName}</td>
                  <td className="py-2 px-4 border">{emp.district}</td>
                  <td className="py-2 px-4 border">{emp.village}</td>
                  <td className="py-2 px-4 border">{emp.through}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => navigate(`/dashboard/details/${emp.id}`)}
                      className="bg-indigo-500 text-white py-1 px-3 rounded hover:bg-indigo-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
