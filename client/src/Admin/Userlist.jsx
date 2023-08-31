import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Typography } from "antd";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Contexts/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

const UserList = () => {
  const { user } = useAuthContext();
  const { Title } = Typography;
  const [data, setdata] = useState([]);

  const columns = [
    {
      title: "SNO.#",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  useEffect(() => {
    const FETCH = async () => {
      const { data } = await axios.get(
        import.meta.env.VITE_URL + "/api/auth/users",
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        }
      );
      setdata(data.users);
      // console.log(data);
    };
    FETCH();
  }, []);

  const dataSource = [
    ...data.map((elem, i) => {
      return {
        key: i + 1,
        sno: elem.uid,
        name: elem.name,
        email: elem.email,
        role: elem.role
      };
    }),
  ];

  if (!user.isAdmin) return <Navigate to="/" />;

  return (
    <div>
      <Title level={window.matchMedia("(max-width: 600px)").matches ? 4 : 3}>
        All Registered Users
      </Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        className="responsiveTable mt-3"
      />
    </div>
  );
};

export default UserList;
