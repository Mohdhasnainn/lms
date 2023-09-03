import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { Navigate } from "react-router";

const AddQuestions = () => {
  const { user } = useAuthContext();
  const [clas, setclas] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (user.classs !== "Both") {
      setclas(user.role);
    }
  });

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
        </div>
      )}
    </div>
  );
};

export default AddQuestions;
