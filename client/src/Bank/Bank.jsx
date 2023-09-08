import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { GiFastBackwardButton } from "react-icons/gi";

const Bank = () => {
  const { userdata, user } = useAuthContext();
  const [slide, setSlide] = useState(0);
  const [clas, setclas] = useState("");
  const [subdata, setSubdata] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [sloading, setSLoading] = useState(false);
  const [tab, setTab] = useState("mcq");
  const [subject, setsubject] = useState(userdata.subject);

  const FETCH = async (cls, subj) => {
    setSLoading(true);
    setsubject(subj);
    const { data } = await axios.get(
      import.meta.env.VITE_URL +
        `/api/bank/chapters?class=${cls}&subject=${subj.toUpperCase().trim()}`,
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

  const FetchQuestions = async (cls, chp, subj) => {
    const { data } = await axios.get(
      import.meta.env.VITE_URL +
        `/api/bank/findqno?class=${cls}&subject=${subj
          .toUpperCase()
          .trim()}&chapter=${chp}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      }
    );
    setSlide(2);
    // console.log(data);
    const sdata = data.data.filter((elem) => {
      return elem.type === "mcq";
    });
    setSubdata(sdata);
    setQuestions(data.data);
  };

  const FilterMCQS = () => {
    const data = questions.filter((elem) => {
      return elem.type === "mcq";
    });
    setSubdata(data);
  };

  const FilterShort = () => {
    const data = questions.filter((elem) => {
      return elem.type === "short";
    });
    setSubdata(data);
  };

  const FilterLong = () => {
    const data = questions.filter((elem) => {
      return elem.type === "long";
    });
    setSubdata(data);
  };

  useEffect(() => {
    if (userdata && userdata.classs !== "Both" && user.isAdmin !== true) {
      const cls = userdata?.classs.split(" ")[0];
      setclas(userdata.classs);
      FETCH(cls, userdata.subject);
      setSlide(1);
    }
  }, []);

  return (
    <div>
      {slide === 0 && (
        <>
          {userdata.role === "Teacher" &&
          userdata.classs.toLowerCase() === "both" ? (
            <div>
              <h2 className="fw-bold text-center">Please Choose class</h2>
              <div className="d-flex align-items-center justify-content-center mt-3">
                <div
                  className="class_card rounded border py-3 px-2 w-25 me-4 fs-5 text-center"
                  type="button"
                  onClick={() => {
                    FETCH("9", userdata.subject);
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
                    FETCH("10", userdata.subject);
                    setclas("10 class");
                    setSlide(1);
                  }}
                >
                  10 class
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="fw-bold text-center">Please Choose class</h2>
              <div className="d-flex align-items-center justify-content-center mt-3">
                <div
                  className="class_card rounded border py-3 px-2 w-25 me-4 fs-5 text-center"
                  type="button"
                  onClick={() => {
                    // FETCH("9");
                    setclas("9 class");
                    setSlide(4);
                  }}
                >
                  9 class
                </div>
                <div
                  className="class_card rounded border py-3 px-2 w-25 fs-5  text-center"
                  type="button"
                  onClick={() => {
                    // FETCH("10");
                    setclas("10 class");
                    setSlide(4);
                  }}
                >
                  10 class
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {slide === 4 && (
        <>
          {clas === "9 class" ? (
            <div className="px-5">
              <GiFastBackwardButton
                size={25}
                className="back"
                cursor={"pointer"}
                onClick={() => setSlide(0)}
              />
              <h1 className="text-center fw-bold">Class 9 Subjects</h1>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded mt-2"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                English
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Urdu
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Maths
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Physics
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Chemistry
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Biology
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Computer
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                PST
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Islamiat
              </p>
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}

      {slide === 1 && (
        <div className="mt-3">
          <GiFastBackwardButton
            size={25}
            className="back"
            cursor={"pointer"}
            onClick={() => setSlide(user.isAdmin ? 4 : 0)}
          />
          <h1 className="text-center fw-bold">
            {clas}, {subject}
          </h1>
          {sloading ? (
            <p className="text-center">Loading</p>
          ) : (
            chapters?.chapters.map((elem, i) => {
              return (
                <div
                  type="button"
                  className="d-flex justify-content-between align-items-center chapter px-3 py-2 bg-gray fs-5 rounded mt-2"
                  key={elem}
                  onClick={() => FetchQuestions(clas, elem, subject)}
                >
                  Chapter {i + 1} : {elem}
                </div>
              );
            })
          )}
        </div>
      )}

      {slide === 2 && (
        <div className="mt-3">
           <GiFastBackwardButton
            size={25}
            className="back"
            cursor={"pointer"}
            onClick={() => setSlide(1)}
          />
          <div className="d-flex align-items-center justify-content-between mx-auto w-75 mt-3">
            <div
              className="class_card rounded border py-3 px-2 w-25 me-4 fs-5 
              text-center"
              style={{
                background: tab === "mcq" && "#1677ff",
                color: tab === "mcq" && "white",
              }}
              type="button"
              onClick={() => {
                setTab("mcq");
                FilterMCQS();
              }}
            >
              MCQS
            </div>
            <div
              className="class_card rounded border py-3 px-2 w-25 fs-5  text-center me-3"
              type="button"
              onClick={() => {
                setTab("short");
                FilterShort();
              }}
              style={{
                background: tab === "short" && "#1677ff",
                color: tab === "short" && "white",
              }}
            >
              SHORT
            </div>
            <div
              className="class_card rounded border py-3 px-2 w-25 fs-5  text-center"
              type="button"
              onClick={() => {
                setTab("long");
                FilterLong();
              }}
              style={{
                background: tab === "long" && "#1677ff",
                color: tab === "long" && "white",
              }}
            >
              LONG
            </div>
          </div>

          <div className="w-75 mx-auto mt-5">
            {subdata.length > 0
              ? subdata.map((elem, i) => {
                  return (
                    <div key={elem.qno}>
                      <p className="fs-5">
                        <span className="fs-6 fw-bold"> {i + 1}.</span>{" "}
                        {elem.qno}
                      </p>
                      <div className="d-flex justify-content-between flex-wrap w-100 align-items-center">
                        {elem?.options &&
                          elem.options.map((e, index) => {
                            const sno = ["a", "b", "c", "d"];
                            return (
                              <p className="mt-1 fs-5 w-50" key={e}>
                                <span className="fs-6 fw-bold text-muted">
                                  {sno[index]}.
                                </span>{" "}
                                {e}
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  );
                })
              : "Nothing to show!"}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bank;
