import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminLogin from "./Auth/AdminLogin";
import StudentLogin from "./Auth/StudentLogin";
import TeacherLogin from "./Auth/TeacherLogin";
import { useAuthContext } from "./Contexts/AuthContext";
import Dashboard from "./Dashboard";

function App() {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>
        {user ? (
          <Route path="*" element={<Dashboard />} />
        ) : (
          <>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/" element={<StudentLogin />} />
            <Route path="/teacher" element={<TeacherLogin />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
