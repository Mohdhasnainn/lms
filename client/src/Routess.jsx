import React from "react";
import { useAuthContext } from "./Contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Userlist from "./Admin/Userlist";
import AddUser from "./Admin/AddUser";
import AddQuestions from "./Teacher/AddQuestions";

const Routess = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      {user?.isAdmin && <Route path="/" element={<Userlist />} />}
      {user?.isAdmin && <Route path="/add" element={<AddUser />} />}
      {user?.role === "Teacher" && (
        <Route
          path="/"
          element={
            <div>
              <h1 className="text-center">Welcome Sir, {user.name}!</h1>
            </div>
          }
        />
      )}

      {user?.role === "Teacher" && (
        <Route path="/addqno" element={<AddQuestions />} />
      )}
      {user?.role === "Student" && (
        <Route
          path="/"
          element={
            <div className="fs-1 text-center">
              Welcome Student, {user.name}!
            </div>
          }
        />
      )}
    </Routes>
  );
};

export default Routess;
