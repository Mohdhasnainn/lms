import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, name, phone, isAdmin, role } = req.body;

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
    },
  };

  const authToken = jwt.sign(data, process.env.JWT_SECRET);
  success = true;

  res.json({ success, msg: "Successfull!", authToken });
});

router.get("/users", async (req, res) => {
  const getUsers = await User.find({isAdmin: false});

  res.json({ users: getUsers });
});

export default router;
