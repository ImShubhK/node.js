const express = require("express");
const router = express.Router();

app.get("/courses", (req, res) => {
  res.json(courses);
});
