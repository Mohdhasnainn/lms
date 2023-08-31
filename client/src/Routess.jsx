import React from "react";
import { useAuthContext } from "./Contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Userlist from "./Admin/Userlist";
import AddUser from "./Admin/AddUser";

const Routess = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      {user?.isAdmin && <Route path="/" element={<Userlist />} />}
      {user?.isAdmin && <Route path="/add" element={<AddUser />} />}
      {user?.role === "Teacher" && (
        <Route path="/" element={<div>Welcome Sir, {user.name}!</div>} />
      )}
       {user?.role === "Student" && (
        <Route path="/" element={<div>Welcome Student, {user.name}!</div>} />
      )}
    </Routes>
  );
};

export default Routess;
