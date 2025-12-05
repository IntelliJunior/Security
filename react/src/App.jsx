import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import RegisterEmployee from "./pages/RegisterEmployee";
import EditEmployee from "./pages/EditEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import SearchEmployee from "./pages/SearchEmployee";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/register"
          element={<ProtectedRoute><RegisterEmployee /></ProtectedRoute>}
        />
        <Route path="/dashboard/search"
        element={<ProtectedRoute><SearchEmployee /></ProtectedRoute>}
         />
        <Route
          path="/dashboard/edit/:id"
          element={<ProtectedRoute><EditEmployee /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/details/:id"
          element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
