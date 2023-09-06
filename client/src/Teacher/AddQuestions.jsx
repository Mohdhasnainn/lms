import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { Navigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { GrSelect } from "react-icons/gr";
import { AiFillQuestionCircle, AiOutlineQuestionCircle } from "react-icons/ai";

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

  console.log(chapters);

  if (!user || user.role !== "Teacher") return <Navigate to={"/"} />;

  return (
    <div className="QnoSection">
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
              chapters?.chapters.map((elem, i) => {
                return (
                  <div
                    type="button"
                    className="d-flex justify-content-between align-items-center chapter px-3 py-2 bg-gray fs-5 rounded mt-2"
                    key={elem}
                  >
                    Chapter {i + 1} : {elem}
                    <div className="ms-3">
                      <GrSelect
                        size={23}
                        className="me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      />
                      <AiOutlineQuestionCircle size={24} className="me-2" />
                      <AiFillQuestionCircle size={24} className="me-2" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog mt-5">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add MCQ's
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label className="fw-bold fs-5">Question:</label>
              <input className="form-control mt-1" type="text" />
              <div className="d-flex mt-3">
                <input className="mt-1" type="radio" 
                name="option" />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 1"
                />
              </div>
              <div className="d-flex mt-3">
                <input className="mt-1" type="radio" name="option" />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 2"
                />
              </div>
              <div className="d-flex mt-2">
                <input className="mt-1" type="radio" 
                name="option" />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 3"
                />
              </div>
              <div className="d-flex mt-2">
                <input className="mt-1" type="radio" name="option" />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
