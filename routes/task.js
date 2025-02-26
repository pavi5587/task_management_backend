const express = require("express");
const router = express.Router();
const Task = require("../models/taskmodel");
const authenticateToken = require("../middleware/auth");
const moment = require("moment");

router.get("/", authenticateToken, async (req, res) => {
  console.log("req.query", req.query);

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const task = await Task.find().skip(skip).limit(limit);

    const totalTask = await Task.countDocuments();

    res.json({
      totalTask,
      totalPages: Math.ceil(totalTask / limit),
      currentPage: page,
      pageSize: limit,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", authenticateToken, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      name: { $regex: query, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    const totalTask = await Task.countDocuments({
      name: { $regex: query, $options: "i" },
    });

    res.json({
      totalTask,
      totalPages: Math.ceil(totalTask / limit),
      currentPage: page,
      pageSize: limit,
      task: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const formattedStartDate = moment(startDate, "DD/MM/YYYY").toDate();
    const formattedEndDate = moment(endDate, "DD/MM/YYYY").toDate();

    const task = new Task({
      ...req.body,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    const newTask = await task.save();
    res.status(201).json({ message: "Task Added successFully", task: newTask });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, name, description, totalTask, status } =
      req.body;
    const taskId = await Task.findById(req.params.id);
    const id = req.params.id;
    if (!taskId) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const formattedStartDate = moment(startDate, "DD/MM/YYYY").toDate();
    const formattedEndDate = moment(endDate, "DD/MM/YYYY").toDate();

    const task = {
      name,
      description,
      totalTask,
      status,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    const updatedTask = await Task.findByIdAndUpdate(id, task, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task Updated Successfully", task: updatedTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(task);
    res.json({ message: "Task deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
