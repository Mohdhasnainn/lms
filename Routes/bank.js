import express from "express";
import { QuestionModel, SubjectModel } from "../Models/Question.js";
import { verifyToken } from "../Middlewares/verifyUser.js";

const router = express.Router();

router.get("/chapters", verifyToken, async (req, res) => {
  const chapters = await SubjectModel.find({
    class: req.query.class,
    subject: req.query.subject,
  });

  res.json({ data: chapters });
});

router.post("/findqno", verifyToken, async (req, res) => {
  const questions = await QuestionModel.find({
    class: req.query.class,
    subject: req.query.subject,
    chapter: req.body.chapter,
  });

  res.json({ data: questions });
});

router.post("/add", verifyToken, async (req, res) => {
  const { qno, options, correct_answer, type, subject, chapter, excel, documents } =
    req.body;

  if (excel) {
    await QuestionModel.insertMany(documents);
    res.json({ msg: "Succesfully added!" });
  } else {
    await QuestionModel.create({
      class: req.body.class,
      qno: qno,
      options,
      correct_answer,
      type,
      subject,
      chapter,
    });
    res.json({ msg: "Succesfully added!" });
  }

});

router.put("/update", verifyToken, async (req, res) => {
  await QuestionModel.findByIdAndUpdate(req.body._id, req.body, { new: true });

  res.json({ msg: "Succesfully updated!" });
});

router.post("/deleteqno", verifyToken, async (req, res) => {
  await QuestionModel.findByIdAndDelete(req.body.id);
  res.json({ msg: "Succesfully Deleted!" });
});

export default router;
