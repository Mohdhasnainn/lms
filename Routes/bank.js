import express from "express";
import { SubjectModel } from "../Models/Question.js";
import { verifyToken } from "../Middlewares/verifyUser.js";

const router = express.Router();

router.get("/chapters", async (req, res) => {
  const chapters = await SubjectModel.find({
    class: req.query.class,
    subject: req.query.subject,
  });

  res.json({ data: chapters });
});


export default router;
