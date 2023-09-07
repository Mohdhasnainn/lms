import express from "express";
import { QuestionModel, SubjectModel } from "../Models/Question.js";
import { verifyToken } from "../Middlewares/verifyUser.js";

const router = express.Router();

router.get("/chapters", async (req, res) => {
  const chapters = await SubjectModel.find({
    class: req.query.class,
    subject: req.query.subject,
  });

  res.json({ data: chapters });
});


router.get("/findqno", async (req, res) => {
  const questions = await QuestionModel.find({
    class: req.query.class,
    subject: req.query.subject,
    chapter: req.query.chapter
  });

  res.json({ data: questions });
});

router.post("/add", async (req, res) => {
  const { qno, options, correct_answer, type, subject, chapter } = req.body;

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
});

export default router;
