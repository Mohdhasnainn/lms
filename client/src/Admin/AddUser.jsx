import React, { useState } from "react";
import { Typography } from "antd";
import Cookies from "js-cookie";
import axios from "axios";

const AddUser = () => {
  const [credential, setCredential] = useState({});
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);

  const HandleClick = async () => {
    try {
      setLoading(true);
      await axios.post(
        import.meta.env.VITE_URL + "/api/auth/register",
        {
          ...credential,
          isAdmin: credential.role === "Admin" ? true : false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        }
      );
      alert('Succesfully created!')
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const HandleChange = (e) => {
    setCredential((data) => ({ ...data, [e.target.id]: e.target.value }));
  };

  return (
    <div>
      <Title level={window.matchMedia("(max-width: 600px)").matches ? 4 : 3}>
        Add User
      </Title>

      <div className="mt-3">
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          className="form-control mt-1"
          id="name"
          onChange={(e) => HandleChange(e)}
        />
        <label className="mt-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={(e) => HandleChange(e)}
          className="form-control mt-1"
        />
        <label className="mt-2">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="form-control mt-1"
          id="password"
          onChange={(e) => HandleChange(e)}
        />
        <label className="mt-2">Phone</label>
        <input
          type="number"
          placeholder="Phone"
          className="form-control mt-1"
          id="phone"
          onChange={(e) => HandleChange(e)}
        />
        <label className="mt-2">Role</label>
        <select
          className="form-control mt-1"
          id="role"
          onChange={(e) => HandleChange(e)}
        >
          <option value={"Admin"}>Admin</option>
          <option value={"Teacher"}>Teacher</option>
          <option value={"Student"}>Student</option>
        </select>
        <button className="btn btn-primary mt-3" onClick={HandleClick}>
          {loading ? "Loading" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default AddUser;
