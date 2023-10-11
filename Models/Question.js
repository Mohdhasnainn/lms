// Import the necessary modules
import mongoose from "mongoose";

// Define a schema for questions
const questionSchema = new mongoose.Schema({
  qno: String,
  options: [String],
  correct_answer: String,
  type: String,
  class: String,
  subject: String,
  chapter: String,
});

// Define a schema for subjects
const subjectSchema = new mongoose.Schema({
  name: String,
  chapters: Array,
  class: String,
  subject: String,
  mcqmarks: {
    type: String,
    default: "",
  },
  shortmarks: {
    type: String,
    default: "",
  },
  longmarks: {
    type: String,
    default: "",
  },
  shortAtt: {
    type: Array,
    default: "",
  },
  longAtt: {
    type: Array,
    default: "",
  },
  mcqTime: {
    type: String,
    default: "",
  },
  theoryTime: {
    type: String,
    default: "",
  },
});

// Create models based on the schemas
const SubjectModel = mongoose.model("subject", subjectSchema);
const QuestionModel = mongoose.model("Question", questionSchema);

// Export the models
export { SubjectModel, QuestionModel };
