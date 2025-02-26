const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//connecting mongodb
mongoose
  .connect("mongodb://localhost:27017/task_management")
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", userRoutes);
app.use("/api/task", taskRoutes);

const port = 8000;
app.listen(port, () => {
  console.log("Server is listening to port " + port);
});
