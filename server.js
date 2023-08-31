import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./Routes/auth.js";
import dotenv from "dotenv";
import path from "path";

// app
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api/auth/", userRoute);

app.use(express.static("client/build"));

app.use("/*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "client", "build", "index.html"));
});

const Connect = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to db!");
  } catch (err) {
    throw err;
  }
};

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/client/dist")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running....");
//   });
// }

const PORT = process.env.PORT || 8500;

app.listen(PORT, () => {
  Connect();
  console.log("Running");
});
