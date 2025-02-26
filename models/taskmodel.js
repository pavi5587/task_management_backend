const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter task Name"],
  },
  description: {
    type: String,
    required: [true, "Please enter task Description"],
  },
  startDate: {
    type: Date,
    required: [true, "Please enter your task Start Date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please enter your task End Date"],
  },
  totalTask: {
    type: Number,
  },
  status: {
    type: String,
    required: [true, "Please enter your task Status"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let schema = mongoose.model("Task", taskSchema);

module.exports = schema;
