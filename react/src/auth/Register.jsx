import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", role: "ADMIN" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMessage("Registration successful!");
    } catch (err) {
      setMessage("Error: " + err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold">Register Admin</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
