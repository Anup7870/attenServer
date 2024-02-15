import express from "express";
import mongoose from "mongoose";
import studentRegisSchema from "../models/student.js";
import Attendence from "../models/attendence.js";
import bcrypt from "bcrypt";
import Student from "../models/student.js";

const router = express.Router();
const db = mongoose.connection; // connected database
const ObjectId = mongoose.Types.ObjectId;
// middle ware
const qrcodeAuth = async (req, res, next) => {
  // console.log("running");
  const { hash } = req.body;
  const year = req.params.year;
  const Student1 = mongoose.model("student", studentRegisSchema, year);
  const student = await Student1.findOne({ hash: hash.toString() });
  if (!student) {
    return res.status(404).json({
      status: "error",
      error: "Student not found",
    });
  }
  const compare = await bcrypt.compare(student.reg, hash);
  if (compare) {
    req.student = student;
    next();
  } else {
    return res.status(403).json({
      status: "error",
      error: "Invalid qr code",
    });
  }
};

//Routes
router.get("/", (req, res) => {
  res.send("Anup kumar");
});

// adding the studnet in the database
router.post("/:year", async (req, res) => {
  const { name, reg, roll } = req.body;
  const year = req.params.year;

  try {
    // if the collection is not present then create the collection
    const collections = await db.db.listCollections({ name: year }).toArray();
    if (collections === 0) {
      await db.createCollection(year);
    }
    const Student1 = mongoose.model("student", studentRegisSchema, year); // creating the model for the each session
    // hashing the reg number
    const salt = await bcrypt.genSalt();
    const hashUniqueString = await bcrypt.hash(reg, salt);

    const newStudnet = new Student1({
      name: name.toLowerCase(),
      reg,
      roll,
      hash: hashUniqueString,
    });

    // checking if the student is already present or not
    const isThere = await Student1.findOne({ reg: reg });
    // console.log(isThere);
    if (!isThere) {
      newStudnet
        .save()
        .then((data) => {
          return res.status(200).json({
            status: "success",
            message: "Student added successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            status: "error",
            error: "Error in adding the student",
          });
        });
    } else {
      return res.status(403).json({
        status: "error",
        error: "Student already present",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      error: "Server error",
    });
  }
});

// to  make the attendence
router.post("/makeAttend/:year/:sem/:id", qrcodeAuth, (req, res) => {
  const studnet = req.student;
  const year = req.params.year;
  const sem = req.params.sem;
  const id = studnet._id;
  const teacherId = req.params.id;

  var today = new Date();
  var years = today.getFullYear();
  var mes = today.getMonth() + 1;
  var dia = today.getDate();
  var fecha = dia + "-" + mes + "-" + years;
  const attendce = new Attendence({
    studnet: id,
    year: year,
    sem: sem,
    teacher: teacherId,
    date: fecha,
  });

  try {
    attendce
      .save()
      .then((data) => {
        return res.status(200).json({
          status: "success",
          message: "Attendence made successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          status: "error",
          error: "Error in making the attendence",
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      error: "Server error",
    });
  }
});

// for other data

router.get("/year", async (req, res) => {
  try {
    const collection = db.db.collection("year");
    const data = await collection.find().toArray();
    // console.log(data[0].year);
    res.status(200).json({
      status: "Sucessful",
      // length:data.length(),
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      error: "Server error",
    });
  }
});
export default router;

// get data according to teacher id and date it taken

router.get("/atten/:id/:sem/:date/:year", async (req, res) => {
  // const date = req.params.date;
  const { id, sem, date, year } = req.params;

  // Find the attendance records
  const attendance = await Attendence.find({
    teacher: id,
    sem: sem,
    date: date,
    year: year,
  })
  // console.log(attendance);
  // If attendance records are found, fetch the student data
  if (attendance.length > 0) {
    const collection = db.collection(year); // Connect to the year (ex- 23-24) collection

    const students = [];

    // Iterate over the attendance records
    for (let attendances of attendance) {
      // Fetch the student data for each attendance record
      const student = await collection.findOne({ _id: new ObjectId(attendances.studnet) });

      // Add the student data to the array
      students.push(student);
    }
      

    // Send the student data in the response
    res.json({
      data: students,
    });
  } else {
    res.status(204).json({
      status: "failed",
      message: "No attendance records found",
    });
  }
});
