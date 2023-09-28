import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { GiFastBackwardButton } from "react-icons/gi";
import jsPDF from "jspdf";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";

const Bank = () => {
  const { userdata, user } = useAuthContext();
  const [slide, setSlide] = useState(0);
  const [clas, setclas] = useState("");
  const [subdata, setSubdata] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sloading, setSLoading] = useState(false);
  const [tab, setTab] = useState("mcq");
  const [subject, setsubject] = useState(userdata.subject);
  const [Mcq, setMCQs] = useState([]);
  const [Mcq2, setMcq2] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [longs, setLongs] = useState([]);
  const [pdfDataUri, setPdfDataUri] = useState(null);
  const [editmcq, setEditMcq] = useState("");

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
    setQuestions(data.data);
    if (tab === "mcq") {
      const sdata = data.data.filter((elem) => {
        return elem.type === "mcq";
      });
      setSubdata(sdata);
    } else if (tab === "short") {
      const sdata = data.data.filter((elem) => {
        return elem.type === "short";
      });
      setSubdata(sdata);
    } else {
      const sdata = data.data.filter((elem) => {
        return elem.type === "long";
      });
      setSubdata(sdata);
    }
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
          { qno: qno.qno, options: qno.options, _id: qno._id },
        ]);
        setMcq2((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, options: qno.options, _id: qno._id },
        ]);
      } else {
        const filtered = Mcq.filter((elem) => {
          return elem._id !== qno._id;
        });
        setMcq2(filtered);
        setMCQs(filtered);
      }
    } else if (tab === "short") {
      if (e.target.checked) {
        setShorts((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, _id: qno._id },
        ]);
      } else {
        const filtered = shorts.filter((elem) => {
          return elem._id !== qno._id;
        });
        setShorts(filtered);
      }
    } else if (tab === "long") {
      if (e.target.checked) {
        setLongs((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, _id: qno._id },
        ]);
      } else {
        const filtered = longs.filter((elem) => {
          return elem._id !== qno._id;
        });
        setLongs(filtered);
      }
    }
  };

  const AddQno2 = async (qno, e) => {
    if (tab === "mcq") {
      if (e.target.checked) {
        setMcq2((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, options: qno.options, _id: qno._id },
        ]);
      } else {
        const filtered = Mcq2.filter((elem) => {
          return elem._id !== qno._id;
        });
        setMcq2(filtered);
      }
    } else if (tab === "short") {
      if (e.target.checked) {
        setShorts((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, _id: qno._id },
        ]);
      } else {
        const filtered = shorts.filter((elem) => {
          return elem._id !== qno._id;
        });
        setShorts(filtered);
      }
    } else if (tab === "long") {
      if (e.target.checked) {
        setLongs((prevDataArray) => [
          ...prevDataArray,
          { qno: qno.qno, _id: qno._id },
        ]);
      } else {
        const filtered = longs.filter((elem) => {
          return elem._id !== qno._id;
        });
        setLongs(filtered);
      }
    }
  };

  const generatePDF1 = (download, question, code) => {
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

    question.forEach((question, index) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);

      doc.text(175, 65, `Code “${code}”`);
      doc.setFontSize(12.5);
      doc.setFont("times", "normal");
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
  };

  const generateMCQPDF = () => {
    generatePDF1(true, Mcq, "A");
    let no1 = Math.random() > 0.2 ? 0.4 : 0.6;
    let mcq2 = Mcq.sort(() => Math.random() - no1);
    generatePDF1(true, mcq2, "B");
    let no2 = no1 === 0.4 ? 0.6 : 0.4;
    let mcq3 = Mcq.sort(() => Math.random() - no2);
    generatePDF1(true, mcq3, "C");
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
        return elem._id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });
  }, [document.querySelectorAll(".select_mcq")]);

  useEffect(() => {
    document.querySelectorAll(".review_mcq").forEach((e) => {
      const exist = Mcq2.filter((elem) => {
        return elem._id === e.value;
      });

      console.log(exist);

      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });
  }, [document.querySelectorAll(".review_mcq")]);

  useEffect(() => {
    document.querySelectorAll(".select_short").forEach((e) => {
      const exist = shorts.filter((elem) => {
        return elem._id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });

    document.querySelectorAll(".review_short").forEach((e) => {
      const exist = shorts.filter((elem) => {
        return elem._id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });
  }, [
    document.querySelectorAll(".select_short"),
    document.querySelectorAll(".review_short"),
  ]);

  useEffect(() => {
    document.querySelectorAll(".select_long").forEach((e) => {
      const exist = longs.filter((elem) => {
        return elem._id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });

    document.querySelectorAll(".review_long").forEach((e) => {
      const exist = longs.filter((elem) => {
        return elem._id === e.value && e.id;
      });
      if (exist.length > 0) {
        document.getElementById(e.id).checked = true;
      } else {
        document.getElementById(e.id).checked = false;
      }
    });
  }, [
    document.querySelectorAll(".select_long"),
    document.querySelectorAll(".review_long"),
  ]);

  useEffect(() => {
    if (userdata && userdata.classs !== "Both" && user.isAdmin !== true) {
      const cls = userdata?.classs.split(" ")[0];
      setclas(userdata.classs);
      FETCH(cls, userdata.subject);
      setSlide(1);
    }
  }, []);

  const HandleDelete = async (elem) => {
    const promptt = confirm("Are you sure?");
    if (promptt) {
      await axios.post(
        import.meta.env.VITE_URL + `/api/bank/deleteqno`,
        {
          id: elem._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        }
      );
      FetchQuestions(clas, elem.chapter, subject);
    }
  };

  const HandleEdit = async () => {
    setLoading(true);
    await axios.put(
      import.meta.env.VITE_URL + `/api/bank/update`,
      {
        ...editmcq,
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      }
    );

    FetchQuestions(clas, editmcq?.chapter, subject);

    if (tab === "short") {
      setTab("short");
      FilterShort();
    } else if (tab === "long") {
      setTab("long");
      FilterLong();
    } else {
      setTab("mcq");
      FilterMCQS();
    }
    setLoading(false);
  };

  return (
    <div>
      {tab === "mcq" ? (
        <div className="d-flex justify-content-end">
          <button
            onClick={() => generateMCQPDF(true)}
            className="d-block btn btn-primary options_btn"
          >
            Download MCQ's
          </button>
          {window.matchMedia("(min-width: 1024px").matches && (
            <button
              onClick={() => generatePDF1(false, Mcq, "A")}
              className="d-block btn btn-warning ms-3 options_btn"
              disabled={pdfDataUri ? true : false}
            >
              Preview
            </button>
          )}
          <button
            className="d-block btn btn-secondary ms-3 options_btn"
            data-bs-toggle="modal"
            data-bs-target="#reviewModal"
            onClick={() => setMcq2(Mcq)}
          >
            Review
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-end">
          <button
            onClick={() => generatePDF2(true)}
            className="d-block btn btn-primary options_btn"
          >
            Download Sub
          </button>
          {window.matchMedia("(min-width: 1024px").matches && (
            <>
              <button
                onClick={() => generatePDF2(false)}
                className="d-block btn btn-warning ms-3 options_btn"
                disabled={pdfDataUri ? true : false}
              >
                Preview
              </button>
              {/* <button
                className="d-block btn btn-secondary ms-3 options_btn"
                data-bs-toggle="modal"
                data-bs-target="#reviewModal"
              >
                Review
              </button> */}
            </>
          )}
        </div>
      )}
      {slide === 0 && (
        <>
          {userdata.role === "Teacher" &&
          userdata.classs.toLowerCase() === "both" ? (
            <div>
              <h2 className="fw-bold text-center mt-4">Please Choose class</h2>
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
                onClick={() => {
                  setSlide(0);
                  setTab("mcq");
                }}
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
              <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                PST
              </p>
              {/* <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Islamiat
              </p> */}
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
              {/* <p
                className="fs-5 mt-1 px-3 py-2 bg-gray rounded"
                type="button"
                onClick={(e) => {
                  FETCH("10", e.target.innerHTML);
                  setSlide(1);
                }}
              >
                Islamiat
              </p> */}
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
          <div className="d-flex align-items-center qno_container justify-content-between mx-auto w-75 mt-3">
            <div
              className="class_card rounded border py-3 px-2 w-25 me-4 fs-5 
              text-center qno_type"
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
              className="class_card rounded qno_type border py-3 px-2 w-25 fs-5  text-center me-3"
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
              className="class_card rounded qno_type border py-3 px-2 w-25 fs-5  text-center"
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

          <div className="w-75 mx-auto mt-5 mcq_container">
            {subdata.length > 0
              ? subdata.map((elem, i) => {
                  return (
                    <div
                      key={elem._id}
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
                        <div className="d-flex justify-content-between mcq_options flex-wrap w-100 align-items-center">
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
                      <AiFillDelete
                        size={25}
                        cursor={"pointer"}
                        color="red"
                        onClick={() => HandleDelete(elem)}
                        className="me-3"
                      />
                      <MdOutlineEdit
                        size={25}
                        cursor={"pointer"}
                        color="BLUE"
                        data-bs-toggle="modal"
                        data-bs-target="#editmcqModal"
                        onClick={() => {
                          setEditMcq(elem);
                        }}
                      />
                    </div>
                  );
                })
              : "Nothing to show!"}
          </div>
        </div>
      )}

      <div
        className="modal fade"
        id="editmcqModal"
        tabIndex="-1"
        aria-labelledby="editmcqModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog mt-5">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editmcqModalLabel">
                Edit {tab.toUpperCase()}
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
              <input
                className="form-control mt-1"
                type="text"
                id={tab}
                value={editmcq?.qno}
                onChange={(e) =>
                  setEditMcq((prev) => ({ ...prev, qno: e.target.value }))
                }
              />
              {tab === "mcq" && editmcq.options && (
                <>
                  <div className="d-flex mt-3">
                    <input
                      className="mt-1"
                      type="radio"
                      name="option"
                      onChange={(e) =>
                        e.target.checked &&
                        setEditMcq((prev) => ({ ...prev, correct_answer: "1" }))
                      }
                      checked={editmcq?.correct_answer === "1"}
                    />
                    <input
                      type="text"
                      contentEditable={true}
                      className="py-1 form-control ms-3"
                      placeholder="Option 1"
                      id="option1"
                      value={editmcq?.options[0]}
                      onChange={(e) =>
                        setEditMcq((prev) => ({
                          ...prev,
                          options: [
                            e.target.value,
                            editmcq?.options[1],
                            editmcq?.options[2],
                            editmcq?.options[3],
                          ],
                        }))
                      }
                    />
                  </div>
                  <div className="d-flex mt-3">
                    <input
                      className="mt-1"
                      type="radio"
                      name="option"
                      onChange={(e) =>
                        e.target.checked &&
                        setEditMcq((prev) => ({ ...prev, correct_answer: "2" }))
                      }
                      checked={editmcq?.correct_answer === "2"}
                    />
                    <input
                      type="text"
                      contentEditable={true}
                      className="py-1 form-control ms-3"
                      placeholder="Option 2"
                      value={editmcq?.options[1]}
                      id="option2"
                      onChange={(e) =>
                        setEditMcq((prev) => ({
                          ...prev,
                          options: [
                            editmcq?.options[0],
                            e.target.value,
                            editmcq?.options[2],
                            editmcq?.options[3],
                          ],
                        }))
                      }
                    />
                  </div>
                  <div className="d-flex mt-2">
                    <input
                      className="mt-1"
                      type="radio"
                      name="option"
                      onChange={(e) =>
                        e.target.checked &&
                        setEditMcq((prev) => ({ ...prev, correct_answer: "3" }))
                      }
                      checked={editmcq?.correct_answer === "3"}
                    />
                    <input
                      type="text"
                      contentEditable={true}
                      className="py-1 form-control ms-3"
                      placeholder="Option 3"
                      id="option3"
                      value={editmcq?.options[2]}
                      onChange={(e) =>
                        setEditMcq((prev) => ({
                          ...prev,
                          options: [
                            editmcq?.options[0],
                            editmcq?.options[1],
                            e.target.value,
                            editmcq?.options[3],
                          ],
                        }))
                      }
                    />
                  </div>
                  <div className="d-flex mt-2">
                    <input
                      className="mt-1"
                      type="radio"
                      name="option"
                      onChange={(e) =>
                        e.target.checked &&
                        setEditMcq((prev) => ({ ...prev, correct_answer: "4" }))
                      }
                      checked={editmcq?.correct_answer === "4"}
                    />
                    <input
                      type="text"
                      contentEditable={true}
                      className="py-1 form-control ms-3"
                      value={editmcq?.options[3]}
                      placeholder="Option 4"
                      id="option4"
                      onChange={(e) =>
                        setEditMcq((prev) => ({
                          ...prev,
                          options: [
                            editmcq?.options[0],
                            editmcq?.options[1],
                            editmcq?.options[2],
                            e.target.value,
                          ],
                        }))
                      }
                    />
                  </div>
                </>
              )}
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
                onClick={() => HandleEdit(editmcq)}
              >
                {loading ? "Loading" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>

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

      <div
        className="modal fade"
        id="reviewModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="reviewModalLabel">
                Review
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="reviewclose"
              ></button>
            </div>
            <div className="modal-body">
              <div style={{ height: "65vh", overflowY: "scroll" }}>
                {Mcq.length > 0
                  ? Mcq.map((elem, i) => {
                      return (
                        <div
                          key={elem._id}
                          className="d-flex align-items-start mt-3"
                        >
                          <input
                            type="checkbox"
                            className={`large-checkbox me-3 mt-1 review_${tab}`}
                            onChange={(e) => AddQno2(elem, e)}
                            id={`R${tab}${i + 1}`}
                            value={elem._id}
                          />
                          <div style={{ width: "95%" }}>
                            <p className="fs-5">
                              <span className="fs-6 fw-bold"> {i + 1}.</span>{" "}
                              {elem.qno}
                            </p>
                            <div className="d-flex justify-content-between mcq_options flex-wrap w-100 align-items-center">
                              {elem?.options &&
                                elem.options.map((e, index) => {
                                  const sno = ["a", "b", "c", "d"];
                                  return (
                                    <p className="mt-1 fs-5 w-50" key={e + "1"}>
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
                onClick={() => {
                  setMCQs(Mcq2);
                  document.getElementById("reviewclose").click();
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bank;
