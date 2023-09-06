import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyTokenAndAdmin } from "../Middlewares/verifyUser.js";
import mongoose from "mongoose";

const router = express.Router();

// Register
router.post("/register", verifyTokenAndAdmin, async (req, res) => {
  const { email, password, name, phone, isAdmin, role, classs, subject } = req.body;

  try {
    const exist = await User.findOne({ email });
    let success = false;
    if (exist) {
      res.status(400).json({ error: "No account exist on this email!" });
    }

    if (!exist) {
      const salt = await bcrypt.genSalt(10);
      let securePassword = await bcrypt.hash(password, salt);
      const users = await User.find();

      await User.create({
        email,
        password: securePassword,
        name,
        phone,
        uid: "ES" + (Number(10000) + Number(users.length + 1)),
        isAdmin,
        role,
        classs,
      });

      success = true;
      res.json({ success, msg: "Successfully registered!" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  let success = false;
  if (!user) {
    return res.status(400).json({ msg: "Incorrect Credentails!" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(400).json({ success, msg: "Invalid credentials!" });
  }

  const data = {
    user: {
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin,
      role: user.role,
      name: user.name,
      disabled: user.disabled,
      classs: user.classs,
      subject: user.subject
    },
  };

  const authToken = jwt.sign(data, process.env.JWT_SECRET);
  success = true;

  res.json({ success, msg: "Successfull!", authToken });
});

router.get("/users", verifyTokenAndAdmin, async (req, res) => {
  const getUsers = await User.find({ isAdmin: false });

  res.json({ users: getUsers });
});


router.get("/user", verifyTokenAndAdmin, async (req, res) => {
  const getUser = await User.findById(req.params.id);

  res.json({ users: getUser });
});


router.put("/active", verifyTokenAndAdmin, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.body.id,
    {
      disabled: false,
    },
    { new: true }
  );

  if (updatedUser) {
    const users = await User.find({ isAdmin: false });
    res.json({
      msg: "Deleted Successfully!",
      data: users,
    });
  }
});

router.put("/disable", verifyTokenAndAdmin, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.body.id,
    {
      disabled: true,
    },
    { new: true }
  );

  if (updatedUser) {
    const users = await User.find({ isAdmin: false });
    res.json({
      msg: "Deleted Successfully!",
      data: users,
    });
  }
});

router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.id.trim(),
    {
      ...req.body,
    },
    { new: true }
  );

  res.json({
    msg: "Updated Successfully!",
  });
});

export default router;
