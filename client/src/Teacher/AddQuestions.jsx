import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { Navigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { GrSelect } from "react-icons/gr";
import { AiFillQuestionCircle, AiOutlineQuestionCircle } from "react-icons/ai";

const AddQuestions = () => {
  const { user, userdata } = useAuthContext();
  const [clas, setclas] = useState("");
  const [slide, setSlide] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [Sloading, setSLoading] = useState(false);
  const [currentChp, setChapter] = useState("");
  const [correct, setCorrect] = useState("");
  const [loading, setLoading] = useState(false);

  const FETCH = async (cls) => {
    setSLoading(true);
    const { data } = await axios.get(
      import.meta.env.VITE_URL +
        `/api/bank/chapters?class=${cls}&subject=${userdata.subject
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

  const AddMCQ = async () => {
    if (correct) {
      setLoading(true);
      await axios.post(
        import.meta.env.VITE_URL + `/api/bank/add`,
        {
          qno: document.getElementById("mcq").value,
          options: [
            document.getElementById("option1").value,
            document.getElementById("option2").value,
            document.getElementById("option3").value,
            document.getElementById("option4").value,
          ],
          chapter: currentChp,
          class: clas,
          subject: userdata.subject,
          correct_answer: correct,
          type: "mcq",
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        }
      );
      document.getElementById("mcq").value = "";
      document.getElementById("option1").value = "";
      document.getElementById("option2").value = "";
      document.getElementById("option3").value = "";
      document.getElementById("option4").value = "";
      setLoading(false);
    } else {
      alert("Please select the correct answer!");
      setLoading(false);
    }
  };

  const AddLong = async () => {
    setLoading(true);
    await axios.post(
      import.meta.env.VITE_URL + `/api/bank/add`,
      {
        qno: document.getElementById("longqno").value,
        chapter: currentChp,
        class: clas,
        subject: userdata.subject,
        correct_answer: correct,
        type: "long",
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      }
    );
    document.getElementById("longqno").value = "";
    setLoading(false);
  };

  const AddShort = async () => {
    setLoading(true);
    await axios.post(
      import.meta.env.VITE_URL + `/api/bank/add`,
      {
        qno: document.getElementById("shortqno").value,
        chapter: currentChp,
        class: clas,
        subject: userdata.subject,
        correct_answer: correct,
        type: "short",
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      }
    );
    document.getElementById("shortqno").value = "";
    setLoading(false);
  };

  useEffect(() => {
    if (userdata && userdata.classs !== "Both") {
      const cls = userdata.classs.split(" ")[0];
      setclas(userdata.classs);
      FETCH(cls);
    }
  }, []);

  if (!user || userdata.role !== "Teacher") return <Navigate to={"/"} />;

  return (
    <div className="QnoSection">
      {userdata.classs === "Both" && slide === 0 && (
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

      {((userdata.classs !== "Both" && slide === 0) ||
        (userdata.classs === "Both" && slide === 1)) && (
        <div>
          <h1 className="text-center fw-bold">
            {userdata.subject} {clas === "9 class" ? "9th class" : "10th class"}
          </h1>
          <div className="mt-3">
            {Sloading ? (
              <p className="text-center">Loading</p>
            ) : (
              chapters.chapters?.map((elem, i) => {
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
                        onClick={() => setChapter(elem)}
                      />
                      <AiOutlineQuestionCircle
                        size={24}
                        className="me-2"
                        onClick={() => setChapter(elem)}
                        data-bs-toggle="modal"
                        data-bs-target="#shortModal"
                      />
                      <AiFillQuestionCircle
                        size={24}
                        className="me-2"
                        onClick={() => setChapter(elem)}
                        data-bs-toggle="modal"
                        data-bs-target="#longModal"
                      />
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
        tabIndex="-1"
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
              <input className="form-control mt-1" type="text" id="mcq" />
              <div className="d-flex mt-3">
                <input
                  className="mt-1"
                  type="radio"
                  name="option"
                  onChange={(e) => e.target.checked && setCorrect(1)}
                />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 1"
                  id="option1"
                />
              </div>
              <div className="d-flex mt-3">
                <input
                  className="mt-1"
                  type="radio"
                  name="option"
                  onChange={(e) => e.target.checked && setCorrect(2)}
                />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 2"
                  id="option2"
                />
              </div>
              <div className="d-flex mt-2">
                <input
                  className="mt-1"
                  type="radio"
                  name="option"
                  onChange={(e) => e.target.checked && setCorrect(3)}
                />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 3"
                  id="option3"
                />
              </div>
              <div className="d-flex mt-2">
                <input
                  className="mt-1"
                  type="radio"
                  name="option"
                  onChange={(e) => e.target.checked && setCorrect(4)}
                />
                <input
                  type="text"
                  contentEditable={true}
                  className="py-1 form-control ms-3"
                  placeholder="Option 4"
                  id="option4"
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={AddMCQ}
              >
                {loading ? "Loading" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="shortModal"
        tabIndex="-1"
        aria-labelledby="shortModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog mt-5">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="shortModalLabel">
                Add Short Question
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
              <textarea
                className="form-control mt-2"
                placeholder="Type question here"
                id="shortqno"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={AddShort}
              >
                {loading ? "Loading" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="longModal"
        tabIndex="-1"
        aria-labelledby="longModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog mt-5">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="longModalLabel">
                Add Long Question
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
              <textarea
                className="form-control mt-2"
                placeholder="Type question here"
                id="longqno"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={AddLong}
              >
                {loading ? "Loading" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
