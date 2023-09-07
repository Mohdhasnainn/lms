import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Typography } from "antd";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Contexts/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiAdminFill } from "react-icons/ri";
import { useAlert } from 'react-alert'

const UserList = () => {
  const alert = useAlert()
  const { user } = useAuthContext();
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [data, setdata] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [student, setStudent] = useState([]);
  const [dstudent, setStudentd] = useState([]);
  const [selected, setSelected] = useState({});
  const [credential, setCredential] = useState({});

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
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
    },
  ];

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
  };

  useEffect(() => {
    FETCH();
  }, []);

  const Active = async (id) => {
    setLoading(true);
    const Confirm = window.confirm("Are you sure you want to activate?");
    if (Confirm) {
      const { data } = await axios.put(
        import.meta.env.VITE_URL + "/api/auth/active",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        }
      );
      setdata(data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const Disable = async (id) => {
    setLoading(true);
    const Confirm = window.confirm("Are you sure you want to disable?");
    if (Confirm) {
      const { data } = await axios.put(
        import.meta.env.VITE_URL + "/api/auth/disable",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        }
      );
      setdata(data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const dataSource = [
    ...data.map((elem, i) => {
      return {
        key: i + 1,
        sno: elem.uid,
        name: elem.name,
        email: elem.email,
        class: elem.classs,
        role: elem.role,
        status: elem.disabled ? "Disabled" : "Active",
        actions: (
          <>
            <button
              type="button"
              className="btn btn-primary me-2"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onClick={() => {
                setSelected(elem);
                setCredential(elem);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger me-2"
              onClick={() => Disable(elem._id)}
              disabled={elem.disabled ? true : false}
            >
              {loading ? "Loading" : "Disable"}
            </button>
            <button
              className="btn btn-warning"
              onClick={() => Active(elem._id)}
              disabled={elem.disabled ? false : true}
            >
              {"Activate"}
            </button>
          </>
        ),
      };
    }),
  ];

  const HandleChange = (e) => {
    setCredential((data) => ({ ...data, [e.target.id]: e.target.value }));
  };

  const UpdateUser = async (user) => {
    try {
      setLoading2(true);
      await axios.put(
        import.meta.env.VITE_URL + `/api/auth/update/${user.id}`,
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
      alert.show(<span className="small">Updated successfully!</span>, {type: "success"})
      FETCH();
      document.getElementById("close").click();
      setLoading2(false);
    } catch (err) {
      alert.show(<span className="small">Something went wrong!</span>, {type: "error"})
      console.log(err);
    }
  };

  const getTeachers = () => {
    const filtered = data.filter((elem) => {
      return elem.role === "Teacher";
    });
    setTeachers(filtered);

    const filtered2 = data.filter((elem) => {
      return elem.role === "Student";
    });
    setStudent(filtered2);

    const filtered3 = data.filter((elem) => {
      return elem.role === "Student" && elem.disabled === true;
    });
    setStudentd(filtered3);
  };

  useEffect(() => {
    getTeachers();
  }, [data]);

  if (!user.isAdmin) return <Navigate to="/" />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between cards">
        <div className="card text-white border-0 dblue px-3 py-5 d-flex align-items-center">
          <PiStudentBold size={40} color="white" />
          <div className="">
            <h3 className="mt-1">Total Students</h3>
            <h4 className="text-center">{student.length}</h4>
          </div>
        </div>
        <div className="card text-white border-0 orange px-3 py-5 d-flex align-items-center">
          <GiTeacher size={40} color="white" />
          <div className="">
            <h3 className="mt-1">Total Teachers</h3>
            <h4 className="text-center">{teachers.length}</h4>
          </div>
        </div>
        <div className="card text-white border-0 blue px-3 py-5 d-flex align-items-center">
          <RiAdminFill size={40} color="white" />
          <div className="">
            <h3 className="mt-1">Disabled Students</h3>
            <h4 className="text-center">{dstudent.length}</h4>
          </div>
        </div>
      </div>

      <Title
        level={window.matchMedia("(max-width: 600px)").matches ? 4 : 3}
        className="mt-3"
      >
        All Registered Users
      </Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        className="responsiveTable mt-3"
      />

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Edit {selected.uid}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                className="form-control mt-1"
                id="name"
                value={credential.name}
                onChange={(e) => HandleChange(e)}
              />
              <label className="mt-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={credential.email}
                id="email"
                onChange={(e) => HandleChange(e)}
                className="form-control mt-1"
              />
              {/* <label className="mt-2">Password</label> */}
              {/* <input
                type="password"
                placeholder="Password"
                className="form-control mt-1"
                id="password"
                onChange={(e) => HandleChange(e)}
              />
              <label className="mt-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control mt-1"
                id="cpassword"
                onChange={(e) => HandleChange(e)}
              /> */}
              <label className="mt-2">Phone</label>
              <input
                type="number"
                placeholder="Phone"
                className="form-control mt-1"
                value={credential.phone}
                id="phone"
                onChange={(e) => HandleChange(e)}
              />
              <label className="mt-2">Role</label>
              <select
                className="form-control mt-1"
                id="role"
                onChange={(e) => HandleChange(e)}
                value={credential.role}
              >
                <option value={"Admin"}>Admin</option>
                <option value={"Teacher"}>Teacher</option>
                <option value={"Student"}>Student</option>
              </select>

              {credential.role !== "Admin" && (
                <>
                  {" "}
                  <label className="mt-2">Class</label>
                  <select
                    className="form-control mt-1"
                    id="classs"
                    onChange={(e) => HandleChange(e)}
                    value={credential.classs}
                  >
                    <option value={"9 class"}>9 class</option>
                    <option value={"10 class"}>10 class</option>
                    <option value={"Both"}>Both</option>
                  </select>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="close"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => UpdateUser(selected)}
              >
                {loading2 ? "Loading" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
