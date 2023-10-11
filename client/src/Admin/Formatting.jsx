import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const Formatting = () => {
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [values, setvalues] = useState("");

  const FetchSubjects = async () => {
    const { data } = await axios.get(
      import.meta.env.VITE_URL + `/api/admin/subjects`,
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      }
    );
    setSubjects(data.data);
  };

  const HandleFormat = async () => {
    setLoading(true);
    await axios.post(
      import.meta.env.VITE_URL + `/api/admin/format`,
      {
        ...selected,
        ...values,
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      }
    );
    setvalues({ mcqmarks: "", shortmarks: "", longmarks: "" });
    setLoading(false);
  };

  useEffect(() => {
    FetchSubjects();
  }, []);

  console.log(values);

  return (
    <div>
      <h1 className="fw-bold text-center">Paper Formatting</h1>

      {subjects.map((elem) => {
        return (
          <div
            className="chapter bg-gray rounded px-3 py-2 mt-3 fs-5"
            type="button"
            data-bs-toggle="modal"
            onClick={() => {
              setvalues({
                mcqmarks: elem.mcqmarks,
                shortmarks: elem.shortmarks,
                longmarks: elem.longmarks,
                shortAtt: elem.shortAtt ? elem.shortAtt : [],
                longAtt: elem.longAtt ? elem.longAtt : [],
                theoryTime: elem.theoryTime,
                mcqTime: elem.mcqTime
              });
              setSelected(elem);
            }}
            data-bs-target="#formatModal"
          >
            {elem.subject} {elem.class}
          </div>
        );
      })}

      <div
        className="modal fade"
        id="formatModal"
        tabIndex="-1"
        aria-labelledby="formatModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog mt-5">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 fw-bold" id="formatModalLabel">
                Format {selected.subject} {selected.class}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <label className="fs-6">Mcq Marks:</label>
                <input
                  className="form-control mt-1"
                  type="number"
                  onChange={(e) =>
                    setvalues((prev) => ({ ...prev, mcqmarks: e.target.value }))
                  }
                  value={values.mcqmarks}
                />

                <label className="fs-6 mt-2">Short Marks:</label>
                <input
                  className="form-control mt-1"
                  type="number"
                  onChange={(e) =>
                    setvalues((prev) => ({
                      ...prev,
                      shortmarks: e.target.value,
                    }))
                  }
                  value={values.shortmarks}
                />

                <label className="fs-6 mt-2">Long Marks:</label>
                <input
                  className="form-control mt-1"
                  type="number"
                  onChange={(e) =>
                    setvalues((prev) => ({
                      ...prev,
                      longmarks: e.target.value,
                    }))
                  }
                  value={values.longmarks}
                />

                <div className="d-flex w-100">
                  <div className="w-50">
                    <label className="fs-6 mt-2">Shorts To Attempt:</label>
                    <input
                      className="form-control mt-1"
                      type="number"
                      onChange={(e) =>
                        setvalues((prev) => ({
                          ...prev,
                          shortAtt: [e.target.value],
                        }))
                      }
                      value={values.shortAtt ? values.shortAtt[0] : ""}
                    />
                  </div>
                  <div className="w-50 ms-2">
                    <label className="fs-6 mt-2">Total Shorts:</label>
                    <input
                      className="form-control mt-1"
                      type="number"
                      onChange={(e) =>
                        setvalues((prev) => ({
                          ...prev,
                          shortAtt: [...prev.shortAtt[0], e.target.value],
                        }))
                      }
                      value={
                        values.shortAtt && values.shortAtt[0]
                          ? values.shortAtt[1]
                          : ""
                      }
                      disabled={values?.shortAtt?.length > 0 ? false : true}
                    />
                  </div>
                </div>

                <div className="d-flex w-100">
                  <div className="w-50">
                    <label className="fs-6 mt-2">Longs To Attempt:</label>
                    <input
                      className="form-control mt-1"
                      type="number"
                      onChange={(e) =>
                        setvalues((prev) => ({
                          ...prev,
                          longAtt: [e.target.value],
                        }))
                      }
                      value={values.longAtt ? values.longAtt[0] : ""}
                    />
                  </div>
                  <div className="w-50 ms-2">
                    <label className="fs-6 mt-2">Total Longs:</label>
                    <input
                      className="form-control mt-1 "
                      type="number"
                      onChange={(e) =>
                        setvalues((prev) => ({
                          ...prev,
                          longAtt: [...prev.longAtt[0], e.target.value],
                        }))
                      }
                      value={
                        values.longAtt && values.longAtt[0]
                          ? values.longAtt[1]
                          : ""
                      }
                      disabled={values?.longAtt?.length > 0 ? false : true}
                    />
                  </div>
                </div>

                <div className="d-flex w-100">
                  <div className="w-50">
                    <label className="fs-6 mt-2">Total MCQ Time:</label>
                    <input
                      className="form-control mt-1"
                      type="text"
                      onChange={(e) =>
                        setvalues((prev) => ({
                          ...prev,
                          mcqTime: e.target.value,
                        }))
                      }
                      values={values.mcqTime}
                    />
                  </div>
                  <div className="w-50 ms-3">
                    <label className="fs-6 mt-2">Total Theory Time:</label>
                    <input
                      className="form-control mt-1"
                      type="text"
                      onChange={(e) =>
                        setvalues((prev) => ({
                          ...prev,
                          theoryTime: e.target.value,
                        }))
                      }
                      values={values.theoryTime}
                    />
                  </div>
                </div>
              </form>
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
                onClick={() => HandleFormat()}
              >
                {loading ? "Loading" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formatting;
