// Import the necessary modules
import mongoose from "mongoose";

// Define a schema for questions
const questionSchema = new mongoose.Schema({
  question_text: String,
  options: [String],
  correct_answer: String,
});

// Define a schema for subjects
const subjectSchema = new mongoose.Schema({
  name: String,
  chapters: Array,
  class: String,
  subject: String
});

// Create models based on the schemas
const SubjectModel = mongoose.model("subject", subjectSchema);
const QuestionModel = mongoose.model("Question", questionSchema);

// Export the models
export { SubjectModel, QuestionModel };
