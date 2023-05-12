const express = require("express");
const axios = require("axios");
const app = express();
const fs = require("fs").promises;
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`hello  world from server on homepage`);
});
// get courses here
COURSES_PATH =
  "https://raw.githubusercontent.com/PatelNeelMahesh/mern_perp/main/node/courses.json";
let courseData = null;

app.get("/courses", async (req, res) => {
  try {
    if (!courseData) {
      const response = await axios.get(COURSES_PATH);
      courseData = response.data;

      res.json(courseData);
    } else {
      res.json(courseData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// get by coursename
app.get("/courses/:courseName", async (req, res) => {
  const courseName = req.params.courseName;

  try {
    if (!courseData) {
      const response = await axios.get(COURSES_PATH);
      courseData = response.data;
    }

    const course = courseData.find((course) => course.name === courseName);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/courses", async (req, res) => {
  const newCourse = req.body;

  try {
    if (!courseData) {
      const response = await axios.get(COURSES_PATH);
      courseData = response.data;
    }

    courseData.push(newCourse);

    await fs.writeFile("courses.json", JSON.stringify(courseData, null, 2));

    res
      .status(201)
      .json({ success: true, message: "Course created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// post course rating
app.post("/courses/courseName/rating", async (req, res) => {
  const newRating = req.body.rating;

  try {
    if (!courseData) {
      const response = await axios.get(COURSES_PATH);
      courseData = response.data;
    }

    const course = courseData.find((course) => course.name === "bocs2");

    if (course) {
      course.rating = newRating;

      await fs.writeFile("courses.json", JSON.stringify(courseData, null, 2));

      res
        .status(201)
        .json({ success: true, message: "Rating added to bocs2 course" });
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT - /courses/bocs2
app.put("/courses/bocs2", async (req, res) => {
  const updatedCourseDetails = req.body;

  try {
    if (!courseData) {
      const response = await axios.get(COURSES_PATH);
      courseData = response.data;
    }

    const course = courseData.find((course) => course.name === "bocs2");

    if (course) {
      course.name = updatedCourseDetails.name || course.name;
      course.description =
        updatedCourseDetails.description || course.description;

      await fs.writeFile("courses.json", JSON.stringify(courseData, null, 2));

      res.json({ success: true, message: "Course details updated" });
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT} `);
});
