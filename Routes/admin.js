import express from "express";
import { QuestionModel, SubjectModel } from "../Models/Question.js";

import { verifyToken, verifyTokenAndAdmin } from "../Middlewares/verifyUser.js";

const router = express.Router();

router.post("/format", verifyTokenAndAdmin, async (req, res) => {
  await SubjectModel.findByIdAndUpdate(
    req.body._id,
    { ...req.body },
    { new: true }
  );

  res.json({ msg: "Successful!" });
});

router.get("/subjects", verifyTokenAndAdmin, async (req, res) => {
  const subjects = await SubjectModel.find();

  res.json({ data: subjects });
});


router.get("/getformat", verifyToken, async (req, res) => {
  const format = await SubjectModel.find({
    subject: req.query.subject,
    class: req.query.class,
  });

  res.json({ ...format });
});

export default router;
