import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu } from "antd";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./Contexts/AuthContext";
import Routess from "./Routess";
import { FiSettings } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { AiFillBank, AiFillPlusCircle } from "react-icons/ai";
import { FaBookMedical } from "react-icons/fa";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const { user, setUser, userdata, setUserdata } = useAuthContext();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(
    window.matchMedia("(max-width: 550px)").matches ? true : false
  );

  const Logout = () => {
    Cookies.remove("token");
    setUser(null);
    setUserdata(null);
    navigate("/");
  };

  const items = [
    {
      key: "3",
      label: (
        <p onClick={Logout} style={{ fontSize: "1.05rem" }}>
          Log out
        </p>
      ),
    },
  ];

  return (
    <>
      <Header
        style={{
          padding: "0 15px",
          background: "dark",
          height: "50px",
        }}
        className="d-flex align-items-center justify-content-between"
      >
        <div className="d-flex align-items-center justify-content-between">
          {React.createElement(MenuOutlined, {
            className: "trigger",
            style: { fontSize: "1.4rem", marginLeft: "10px", color: "#fff" },
            onClick: () => setCollapsed(!collapsed),
          })}
          {/* <p className="text-white ms-3">{userdata?.role}</p> */}
        </div>

        <div className="d-flex align-items-center ms-auto">
          <p className="fs-6 text-white">{user?.email}</p>
          <Dropdown
            menu={{
              items,
            }}
          >
            <div className="ms-3">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#545454",
                  height: "45px",
                  width: "46px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
              >
                <FiSettings size={25} color="white" />
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={`/${[window.location.href.split("/")[3]]}`}
            onClick={(item) => {
              navigate(item.key);
            }}
            items={[
              user?.isAdmin && {
                key: "/",
                icon: <HiUsers size={25} color="white" />,
                label: "User List",
              },
              user?.isAdmin && {
                key: "/add",
                icon: <AiFillPlusCircle size={25} color="white" />,
                label: "Add User",
              },
              userdata?.role === "Teacher" && {
                key: "/",
                icon: <HiUsers size={25} color="white" />,
                label: "Welcome",
              },
              userdata?.role === "Teacher" && {
                key: "/addqno",
                icon: <FaBookMedical size={22} color="white" />,
                label: "Add Questions",
              },
              (userdata?.role === "Teacher" || userdata?.role === "Admin") && {
                key: "/qnobank",
                icon: <AiFillBank size={22} color="white" />,
                label: "Questions Bank",
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: "100vh",
              width: "95%",
              background: "white",
              overflow: "auto",
            }}
          >
            <Routess />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default Dashboard;
