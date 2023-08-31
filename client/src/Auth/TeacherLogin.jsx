import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/logo.jpg";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuthContext } from "../Contexts/AuthContext";
import { Navigate } from "react-router";

const TeacherLogin = () => {
  const {setUser} = useAuthContext();
  const [credential, setCredential] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post(
      import.meta.env.VITE_URL + "/api/auth/login",
      {
        email: credential.email,
        password: credential.password,
      }
    );

    const token = jwt_decode(data.authToken);

    if (!token.user.isAdmin && token.user.role === "Teacher") {
      Cookies.set("token", data.authToken, { expires: 1, secure: true });
      setUser(token?.user)
      navigate("/");
    } else {
      alert("Incorrect credentials!");
    }
    
  };

  if(user) return <Navigate to={"/"} />

  return (
    <div className="login_bg">
      <img src={logo} className="loginLogo" alt="CAVE Education logo" />
      <div className="mx-auto login">
        <h1 className="text-center fw-bold">Teacher Portal</h1>
        <form onSubmit={handleSubmit} className="mt-3">
          <div>
            <label>Email :</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1"
              required
              onChange={(e)=> setCredential((data) => ({
                ...data,
                email: e.target.value,
              }))}
            />
          </div>
          <div className="mt-2">
            <label>Password :</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1"
              required
              onChange={(e)=> setCredential((data) => ({
                ...data,
                password: e.target.value,
              }))}
            />
          </div>
          <button className="btn btn-primary mt-3 text-white px-3" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
