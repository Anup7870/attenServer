import express from "express";
const router = express.Router();
//atuh route
import Teacher from "../models/teacher.js";
import jwt from "jsonwebtoken";
import 'dotenv/config.js'

// teacher login
router.post("/auth", async (req, res) => {
  const { userId, password } = req.body;
  // console.log(req.body.data);
  // console.log(userId + " " + password);
  try {
    const auth = await Teacher.findOne({ userId: userId });
    if (auth) {
      if (auth.password === password) {
        const accessToken = jwt.sign(
          { id: auth._id },
          process.env.ACCESS_TOKEN_SECRET
        );
        return res.status(200).json({
          status: "Sucessfull",
          accessToken: accessToken,
        });
      } else {
        return res.status(401).json({
          status: "failes",
          message: "Check the credentials",
        });
      }
    }
    return res.status(401).json({
      status: "failes",
      message: "uesr not exist",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      message: "server error",
    });
  }
});

// middle ware for token verification
const tokenVerification = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (token == null) return res.status(400);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  });
};

// for token verifcation
router.get("/auth/token", tokenVerification, async (req, res) => {
  const teacher = await Teacher.findOne({_id:req.user.id})
  if(teacher){
    return res.status(200).json({
      status:"sucess",
      data:teacher
    })
  }
  return res.status(501).json({
    satus:"Failed",
    message:"unable to verify the message"
  })
  
});

export default router;
