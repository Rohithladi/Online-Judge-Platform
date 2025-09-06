const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  constraints: String,
  tags: [String],
  visibleTestCases: [testCaseSchema],
  hiddenTestCases: [testCaseSchema],
  sampleInput: String,
  sampleOutput: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Problem', problemSchema);
