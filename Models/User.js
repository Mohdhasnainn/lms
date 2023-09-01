import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  classs: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", UserSchema);
