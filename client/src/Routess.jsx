import React from "react";
import { useAuthContext } from "./Contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Userlist from "./Admin/Userlist";
import AddUser from "./Admin/AddUser";
import AddQuestions from "./Teacher/AddQuestions";
import Bank from "./Bank/Bank";
import Formatting from "./Admin/Formatting";

const Routess = () => {
  const { userdata , user} = useAuthContext();

  return (
    <Routes>
      {userdata?.isAdmin && <Route path="/" element={<Userlist />} />}
      {userdata?.isAdmin && <Route path="/add" element={<AddUser />} />}
      {userdata?.isAdmin && <Route path="/format" element={<Formatting />} />}
      {userdata?.role === "Teacher" && (
        <Route
          path="/"
          element={
            <div>
              <h1 className="text-center">Welcome Sir, {user.name}!</h1>
            </div>
          }
        />
      )}

      {userdata?.role === "Teacher" && (
        <Route path="/addqno" element={<AddQuestions />} />
      )}
      {(userdata?.role === "Teacher" || user.role === "Admin") && (
        <Route path="/qnobank" element={<Bank />} />
      )}
      {userdata?.role === "Student" && (
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
