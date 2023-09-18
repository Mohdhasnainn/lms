import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { GiFastBackwardButton } from "react-icons/gi";
import jsPDF from "jspdf";

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
  const [Mcq, setMCQs] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [longs, setLongs] = useState([]);
  const [pdfDataUri, setPdfDataUri] = useState(null);

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

  const AddQno = async (qno, e) => {
    if (tab === "mcq") {
      if (e.target.checked) {
        setMCQs((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, options: qno.options, id: qno._id },
        ]);
      } else {
        const filtered = Mcq.filter((elem) => {
          return elem.id !== qno._id;
        });
        setMCQs(filtered);
      }
    } else if (tab === "short") {
      if (e.target.checked) {
        setShorts((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, id: qno._id },
        ]);
      } else {
        const filtered = shorts.filter((elem) => {
          return elem.id !== qno._id;
        });
        setShorts(filtered);
      }
    } else if (tab === "long") {
      if (e.target.checked) {
        setLongs((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, id: qno._id },
        ]);
      } else {
        const filtered = longs.filter((elem) => {
          return elem.id !== qno._id;
        });
        setLongs(filtered);
      }
    }
  };

  function shuffleArray(array) {
    // Shuffle the array in-place using the Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const generatePDF = (download) => {
    const doc = new jsPDF();
    let yOffset = 135;
    const columnWidth = doc.internal.pageSize.width / 2 - 20; // Divide the page into two columns

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX =
      (pageWidth -
        doc.getTextWidth(
          "Important Note: This paper is a property of private coaching center"
        ) /
          2) /
      2;

    doc.setFontSize(10); // Reset the font size
    doc.setLineWidth(0.2);

    doc.setFont("times", "normal");

    doc.text(
      centerX,
      10,
      `Important Note: This paper is a property of private coaching center`
    );

    const startX = centerX;
    const endX =
      startX +
      doc.getTextWidth(
        "Important Note: This paper is a property of private coaching center"
      );
    const lineY = 10 + 2;

    doc.line(startX, lineY, endX, lineY);

    // Text 2
    doc.setFontSize(14); // Reset the font size
    const CenterX2 =
      (pageWidth - doc.getTextWidth("BOARD OF SECONDARY EDUCATION KARACHI")) /
      2;

    doc.setFont("times", "bold");

    doc.text(
      CenterX2 + Math.abs(CenterX2 - centerX) / 2,
      18,
      `BOARD OF SECONDARY EDUCATION KARACHI`
    );

    const startX2 = CenterX2 + Math.abs(CenterX2 - centerX) / 2;
    const endX2 =
      startX2 + doc.getTextWidth("BOARD OF SECONDARY EDUCATION KARACHI");
    const lineY2 = 18 + 2;

    doc.line(startX2, lineY2, endX2, lineY2);

    // Text 3

    const CenterX3 =
      (pageWidth - doc.getTextWidth(`MODULE I-${new Date().getFullYear()}`)) /
      2;

    doc.text(
      CenterX3 + Math.abs(CenterX3 - centerX) / 2,
      26,
      `MODULE I-${new Date().getFullYear()}`
    );

    const startX3 = CenterX3 + Math.abs(CenterX3 - centerX) / 2;
    const endX3 =
      startX3 + doc.getTextWidth(`MODULE I-${new Date().getFullYear()}`);
    const lineY3 = 26 + 2;

    doc.line(startX3, lineY3, endX3, lineY3);

    // Text 4
    const CenterX4 =
      (pageWidth - doc.getTextWidth(`${subject.toUpperCase()} (THEORY)`)) / 2;

    doc.text(
      CenterX4 + Math.abs(CenterX4 - CenterX3),
      34,
      `${subject.toUpperCase()} (THEORY)`
    );

    const startX4 = CenterX4 + Math.abs(CenterX4 - CenterX3);
    const endX4 =
      startX4 + doc.getTextWidth(`${subject.toUpperCase()} (THEORY)`);
    const lineY4 = 34 + 2;

    doc.line(startX4, lineY4, endX4, lineY4);

    // Text 5
    const CenterX5 =
      (pageWidth -
        doc.getTextWidth(
          `${clas === "9 class" ? "(PAPER I Class-IX)" : "(PAPER II Class-X)"}`
        )) /
      2;

    doc.text(
      CenterX5 + Math.abs(CenterX5 - centerX) / 2,
      42,
      `${clas === "9 class" ? "(PAPER I Class-IX)" : "(PAPER II Class-X)"}`
    );

    const startX5 = CenterX5 + Math.abs(CenterX5 - centerX) / 2;
    const endX5 =
      startX5 +
      doc.getTextWidth(
        `${clas === "9 class" ? "(PAPER I Class-IX)" : "(PAPER II Class-X)"}`
      );
    const lineY5 = 42 + 2;

    doc.line(startX5, lineY5, endX5, lineY5);

    // Text 6
    const CenterX6 =
      (pageWidth - doc.getTextWidth(`(SCIENCE & GENERAL GROUP)`)) / 2;

    doc.text(
      CenterX6 + Math.abs(CenterX6 - CenterX5) / 2,
      50,
      `(SCIENCE & GENERAL GROUP)`
    );

    const startX6 = CenterX6 + Math.abs(CenterX6 - CenterX5) / 2;
    const endX6 = startX6 + doc.getTextWidth(`(SCIENCE & GENERAL GROUP)`);
    const lineY6 = 50 + 2;

    doc.line(startX6, lineY6, endX6, lineY6);

    // Text 7
    doc.setFontSize(11); // Reset the font size

    doc.text(12, 57, `General Instructions:`);

    const endX7 = 12 + doc.getTextWidth(`General Instructions:`);
    const lineY7 = 57 + 2;

    doc.line(12, lineY7, endX7, lineY7);

    doc.setFontSize(10); // Reset the font size
    doc.setFont("times", "normal");

    doc.text(
      12,
      63,
      `Section ‘A’: It consists of ** Multiple choice questions (MCQs) and all of them are to be answered.`
    );

    doc.text(
      12,
      67,
      `Section ‘B’: It comprises of ** short answer questions and all of them are to be answered.`
    );

    doc.text(
      12,
      71,
      `Section ‘C’: It comprises of ** Descriptive answer questions and all of them are to be answered.`
    );

    // Text 8
    doc.setFontSize(12); // Reset the font size
    doc.setFont("Helvetica", "bold");
    doc.text(10, 34, `Total time: 3 HRS`);
    doc.text(170, 34, `Max. Marks:`);
    doc.setFontSize(16); // Reset the font size

    // Text 8
    const CenterX8 =
      pageWidth -
      doc.getTextWidth(
        "SECTION ‘A’(COMPULSORY) MULTIPLE CHOICE QUESTIONS (M.C.QS)"
      );

    doc.setFont("times", "bold");
    doc.setFontSize(14); // Reset the font size

    doc.text(
      CenterX8,
      80,
      `SECTION ‘A’(COMPULSORY) MULTIPLE CHOICE QUESTIONS (M.C.QS)`
    );

    const startX8 = CenterX8;
    const endX8 =
      startX8 +
      doc.getTextWidth(
        "SECTION ‘A’(COMPULSORY) MULTIPLE CHOICE QUESTIONS (M.C.QS)"
      );
    const lineY8 = 80 + 2;

    doc.line(startX8, lineY8, endX8, lineY8);

    doc.setFontSize(13); // Reset the font size

    doc.text(10, 90, `Note:`);

    const endX9 = 10 + doc.getTextWidth("Note");
    const lineY9 = 90 + 2;

    doc.line(10, lineY9, endX9, lineY9);

    // MCQS
    doc.setFont("times", "normal");
    doc.setFontSize(12.5); // Reset the font size

    doc.text(
      10,
      98,
      `(i) Attempt all the questions of this Section.
(ii) Do not copy down the part questions. Write only the answer against the proper number of 
the question and its part according to the question paper.
(iii) Each question carries 1 mark.
(iv) Write the code of your question paper in bold letters in the beginning of the answer script.
`
    );

    doc.text(
      10,
      125,
      `1. Choose the correct answer for each question from the given options: - `
    );

    const numberOfVersions = 3;
    for (let version = 1; version <= numberOfVersions; version++) {
      const shuffledQuestions = [...Mcq];
      shuffleArray(shuffledQuestions);

      shuffledQuestions.forEach((question, index) => {
        const x = 175;
        const y = 60;
        const width = 200;
        const height = 100;
        doc.text(175, 65, `Code “A”`);

        doc.setFillColor(255, 255, 255);
        doc.rect(x, y, width, height, "F");


        doc.setFont("Helvetica", "bold")
        doc.setFontSize(14)

        if (version === 1) {
          doc.text(175, 65, `Code “A”`);
        } else if (version === 2) {
          doc.setTextColor(0, 0, 0);
          doc.text(175, 65, `Code “B”`);
        } else if (version === 3) {
          doc.setTextColor(0, 0, 0);
          doc.text(175, 65, `Code “C”`);
        }

        doc.setFontSize(12.5);
        doc.setFont("times", "normal")
        doc.text(10, yOffset, `${index + 1}) ${question.qno}`);

        let optionXOffset = 10;
        let optionYOffset = yOffset + 6.4;

        const optionLabels = ["a", "b", "c", "d"];

        question.options.forEach((option, optionIndex) => {
          doc.text(
            optionXOffset,
            optionYOffset,
            `${optionLabels[optionIndex]}. ${option}`
          );

          if ((optionIndex + 1) % 2 === 0) {
            optionYOffset += 6.4;
            optionXOffset = 10;
          } else {
            optionXOffset += columnWidth + 10;
          }
        });

        yOffset = optionYOffset + 2;
      });

      if (download) {
        doc.save("question_paper.pdf");
      } else {
        const dataUri = doc.output("datauristring"); // Get the PDF content as a data URI
        setPdfDataUri(dataUri);
      }
    }
  };

  const generatePDF2 = (download) => {
    const doc = new jsPDF();
    let yOffset = 105;

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX =
      (pageWidth -
        doc.getTextWidth(
          "Important Note: This paper is a property of private coaching center"
        ) /
          2) /
      2;

    doc.setFontSize(10); // Reset the font size
    doc.setLineWidth(0.2);

    doc.setFont("times", "normal");

    doc.text(
      centerX,
      10,
      `Important Note: This paper is a property of private coaching center`
    );

    const startX = centerX;
    const endX =
      startX +
      doc.getTextWidth(
        "Important Note: This paper is a property of private coaching center"
      );
    const lineY = 10 + 2;

    doc.line(startX, lineY, endX, lineY);

    // Text 2
    doc.setFontSize(14); // Reset the font size
    const CenterX2 =
      (pageWidth - doc.getTextWidth("BOARD OF SECONDARY EDUCATION KARACHI")) /
      2;

    doc.setFont("times", "bold");

    doc.text(
      CenterX2 + Math.abs(CenterX2 - centerX) / 2,
      18,
      `BOARD OF SECONDARY EDUCATION KARACHI`
    );

    const startX2 = CenterX2 + Math.abs(CenterX2 - centerX) / 2;
    const endX2 =
      startX2 + doc.getTextWidth("BOARD OF SECONDARY EDUCATION KARACHI");
    const lineY2 = 18 + 2;

    doc.line(startX2, lineY2, endX2, lineY2);

    // Text 3

    const CenterX3 =
      (pageWidth - doc.getTextWidth(`MODULE I-${new Date().getFullYear()}`)) /
      2;

    doc.text(
      CenterX3 + Math.abs(CenterX3 - centerX) / 2,
      26,
      `MODULE I-${new Date().getFullYear()}`
    );

    const startX3 = CenterX3 + Math.abs(CenterX3 - centerX) / 2;
    const endX3 =
      startX3 + doc.getTextWidth(`MODULE I-${new Date().getFullYear()}`);
    const lineY3 = 26 + 2;

    doc.line(startX3, lineY3, endX3, lineY3);

    // Text 4
    const CenterX4 =
      (pageWidth - doc.getTextWidth(`${subject.toUpperCase()} (THEORY)`)) / 2;

    doc.text(
      CenterX4 + Math.abs(CenterX4 - CenterX3),
      34,
      `${subject.toUpperCase()} (THEORY)`
    );

    const startX4 = CenterX4 + Math.abs(CenterX4 - CenterX3);
    const endX4 =
      startX4 + doc.getTextWidth(`${subject.toUpperCase()} (THEORY)`);
    const lineY4 = 34 + 2;

    doc.line(startX4, lineY4, endX4, lineY4);

    // Text 5
    const CenterX5 =
      (pageWidth -
        doc.getTextWidth(
          `${clas === "9 class" ? "(PAPER I Class-IX)" : "(PAPER II Class-X)"}`
        )) /
      2;

    doc.text(
      CenterX5 + Math.abs(CenterX5 - centerX) / 2,
      42,
      `${clas === "9 class" ? "(PAPER I Class-IX)" : "(PAPER II Class-X)"}`
    );

    const startX5 = CenterX5 + Math.abs(CenterX5 - centerX) / 2;
    const endX5 =
      startX5 +
      doc.getTextWidth(
        `${clas === "9 class" ? "(PAPER I Class-IX)" : "(PAPER II Class-X)"}`
      );
    const lineY5 = 42 + 2;

    doc.line(startX5, lineY5, endX5, lineY5);

    // Text 6
    const CenterX6 =
      (pageWidth - doc.getTextWidth(`(SCIENCE & GENERAL GROUP)`)) / 2;

    doc.text(
      CenterX6 + Math.abs(CenterX6 - CenterX5) / 2,
      50,
      `(SCIENCE & GENERAL GROUP)`
    );

    const startX6 = CenterX6 + Math.abs(CenterX6 - CenterX5) / 2;
    const endX6 = startX6 + doc.getTextWidth(`(SCIENCE & GENERAL GROUP)`);
    const lineY6 = 50 + 2;

    doc.line(startX6, lineY6, endX6, lineY6);

    doc.text(10, 60, `Important Instructions:`);

    const endX9 = 10 + doc.getTextWidth("Important Instructions:");
    const lineY9 = 60 + 2;

    doc.line(10, lineY9, endX9, lineY9);

    // Text 7
    const CenterX7 =
      (pageWidth - doc.getTextWidth(`SECTION ‘B’ (SHORT ANSWER-QUESTIONS)`)) /
      2;
    doc.text(
      CenterX7 + Math.abs(CenterX6 - CenterX7) / 2,
      85,
      `SECTION ‘B’ (SHORT ANSWER-QUESTIONS)`
    );
    const startX8 = CenterX7 + Math.abs(CenterX6 - CenterX7) / 2;
    const endX8 =
      startX8 + doc.getTextWidth("SECTION ‘B’ (SHORT ANSWER-QUESTIONS)");
    const lineY8 = 85 + 2;

    doc.line(startX8, lineY8, endX8, lineY8);

    doc.text(175, 85, `(Marks: 40)`);

    doc.setFontSize(13);
    doc.text(10, 90, `Note:`);

    const endX10 = 10 + doc.getTextWidth("Note:");
    const lineY10 = 90 + 2;

    doc.line(10, lineY10, endX10, lineY10);

    doc.setFont("times", "normal");
    doc.setFontSize(12.5);

    doc.text(
      10,
      68,
      `This paper consisting of Short-Answer Questions (Section ‘B’) and Descriptive-Answer Questions 
(Section ‘C’) is being given after 30 minutes. Its total duration is 2 1/2  hours only.`
    );

    doc.text(
      10,
      98,
      "Answer any 10 question from this section. Each question carries 4 marks."
    );

    shorts.forEach((question, index) => {
      doc.setFontSize(12.5);
      doc.text(10, yOffset, `${index + 1}) ${question.qno}`);
      yOffset = yOffset + 6.5;
    });

    doc.setFontSize(14);
    doc.setFont("times", "bold");

    yOffset = yOffset + 40;
    const CenterXL =
      (pageWidth -
        doc.getTextWidth(`SECTION ‘C’ (DETAILED ANSWER-QUESTIONS)`)) /
      2;
    doc.text(
      CenterXL + Math.abs(CenterX7 - CenterXL) / 2,
      yOffset - 15,
      `SECTION ‘C’ (DETAILED ANSWER-QUESTIONS)`
    );
    const startXL = CenterXL + Math.abs(CenterX7 - CenterXL) / 2;
    const endXL =
      startXL + doc.getTextWidth("SECTION ‘C’ (DETAILED ANSWER-QUESTIONS)");
    const lineYL = yOffset - 13;

    doc.line(startXL, lineYL, endXL, lineYL);

    doc.text(175, yOffset - 15, `(Marks: 28)`);

    doc.text(10, yOffset - 8, `Note:`);

    const endXL1 = 10 + doc.getTextWidth("Note");
    const lineXL1 = yOffset - 6;

    doc.line(10, lineXL1, endXL1, lineXL1);

    doc.setFont("times", "normal");

    doc.text(
      10,
      yOffset,
      "Answer any 2 question from this section. Each question carries 14 marks."
    );

    longs.forEach((question, index) => {
      doc.setFontSize(12.5);
      doc.text(10, yOffset + 6.5, `${index + 1}) ${question.qno}`);
      yOffset = yOffset + 6.5;
    });

    if (download) {
      doc.save("question_paper.pdf");
    } else {
      const dataUri = doc.output("datauristring"); // Get the PDF content as a data URI
      setPdfDataUri(dataUri);
    }
  };

  useEffect(() => {
    document.querySelectorAll(".select_mcq").forEach((e) => {
      const exist = Mcq.filter((elem) => {
        return elem.id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });
  }, [document.querySelectorAll(".select_mcq")]);

  useEffect(() => {
    document.querySelectorAll(".select_short").forEach((e) => {
      const exist = shorts.filter((elem) => {
        return elem.id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });
  }, [document.querySelectorAll(".select_short")]);

  useEffect(() => {
    document.querySelectorAll(".select_long").forEach((e) => {
      const exist = longs.filter((elem) => {
        return elem.id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });
  }, [document.querySelectorAll(".select_long")]);

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
      {tab === "mcq" ? (
        <div className="d-flex justify-content-end">
          <button
            onClick={() => generatePDF(true)}
            className="d-block btn btn-primary"
          >
            Download MCQ's
          </button>
          <button
            onClick={() => generatePDF(false)}
            className="d-block btn btn-warning ms-3"
            disabled={pdfDataUri ? true : false}
          >
            Preview
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-end">
          <button
            onClick={() => generatePDF2(true)}
            className="d-block btn btn-primary"
          >
            Download Sub
          </button>
          <button
            onClick={() => generatePDF2(false)}
            className="d-block btn btn-warning ms-3"
            disabled={pdfDataUri ? true : false}
          >
            Preview
          </button>
        </div>
      )}
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
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                English
              </p>
              {/* <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Urdu
              </p> */}
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(10);
                }}
              >
                Maths
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Physics
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Computer
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Chemistry
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Biology
              </p>
              {/* <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                PST
              </p> */}
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Islamiat
              </p>
            </div>
          ) : (
            <div className="px-5">
              <GiFastBackwardButton
                size={25}
                className="back"
                cursor={"pointer"}
                onClick={() => setSlide(0)}
              />
              <h1 className="text-center fw-bold">Class 10 Subjects</h1>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded mt-2"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                English
              </p>
              {/* <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Urdu
              </p> */}
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Maths
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Physics
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Chemistry
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Biology
              </p>
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Computer
              </p>
              {/* <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("9", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                PST
              </p> */}
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Islamiat
              </p>
            </div>
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
                    <div
                      key={elem.qno}
                      className="d-flex align-items-start mt-3"
                    >
                      <input
                        type="checkbox"
                        className={`large-checkbox me-3 mt-1 select_${tab}`}
                        onChange={(e) => AddQno(elem, e)}
                        id={`${tab}${i + 1}`}
                        value={elem._id}
                      />
                      <div style={{ width: "95%" }}>
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
                    </div>
                  );
                })
              : "Nothing to show!"}
          </div>
        </div>
      )}

      {pdfDataUri && (
        <>
          <button
            onClick={() => setPdfDataUri(null)}
            style={{
              zIndex: 20000000000,
              position: "fixed",
              right: "10%",
              top: 10,
            }}
            className="btn btn-danger px-3"
          >
            Close
          </button>
          <iframe
            style={{
              position: "fixed",
              top: 0,
              width: "100%",
              height: "100%",
              left: "0%",
            }}
            title="PDF Viewer"
            width="100%"
            height="600"
            src={pdfDataUri}
            frameBorder="0"
          />
        </>
      )}
    </div>
  );
};

export default Bank;
