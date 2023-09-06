import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { Navigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import {GrSelect} from "react-icons/gr";
import {AiFillQuestionCircle, AiOutlineQuestionCircle} from "react-icons/ai"

const AddQuestions = () => {
  const { user } = useAuthContext();
  const [clas, setclas] = useState("");
  const [slide, setSlide] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [Sloading, setSLoading] = useState(false);

  useEffect(() => {
    if (user.classs !== "Both") {
      setclas(user.role);
    }
  });

  const FETCH = async (cls) => {
    setSLoading(true);
    const { data } = await axios.get(
      import.meta.env.VITE_URL +
        `/api/bank/chapters?class=${cls}&subject=${user.subject
          .toUpperCase()
          .trim()}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      }
    );
    setChapters(data.data[0]);
    setSLoading(false);
  };

  if (!user || user.role !== "Teacher") return <Navigate to={"/"} />;

  return (
    <div>
      {user.classs === "Both" && slide === 0 && (
        <div>
          <h2 className="fw-bold text-center">Please Choose class</h2>
          <div className="d-flex align-items-center justify-content-center mt-3">
            <div
              className="class_card rounded border py-3 px-2 w-25 me-4 fs-5 text-center"
              type="button"
              onClick={() => {
                FETCH("9");
                setclas("9 class");
                setSlide(1);
              }}
            >
              9 class
            </div>
            <div
              className="class_card rounded border py-3 px-2 w-25 fs-5  text-center"
              type="button"
              onClick={() => {
                FETCH("10");
                setclas("10 class");
                setSlide(1);
              }}
            >
              10 class
            </div>
          </div>
        </div>
      )}

      {((user.classs !== "Both" && slide === 0) ||
        (user.classs === "Both" && slide === 1)) && (
        <div>
          <h1 className="text-center fw-bold">
            {user.subject} {clas === "9 class" ? "9th class" : "10th class"}
          </h1>
          <div className="mt-3">
            {Sloading ? (
              <p className="text-center">Loading</p>
            ) : (
              chapters?.chapters.map((elem) => {
                return (
                  <div
                    type="button"
                    className="d-flex justify-content-between align-items-center chapter px-3 py-2 bg-gray fs-5 rounded mt-2"
                    key={elem}
                  >
                    Chapter {elem}
                    <div className="ms-3">
                      <GrSelect size={23} className="me-2"/>
                      <AiOutlineQuestionCircle size={24} className="me-2"/>
                      <AiFillQuestionCircle size={24} className="me-2"/>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestions;
