/**
 * This is the main server file for the attendance application.
 * It initializes the server and sets up the necessary routes and middleware.
 */
/**
 * This file is the entry point for the server.
 * It imports the Express framework and sets up the server.
 */
import express, { json } from "express"
import studentRegis from "./Routes/StudentRegis.js"
import mongoose from "mongoose";
import teacher from './Routes/Teacher.js'
import bodyParser from "body-parser"
import cors from "cors"
const app = express();
// const uri = "mongodb://localhost:27017/Attendence"
const uri = "mongodb+srv://Anup:MOXOKqgZYdZqIb97@cluster0.xcjddg7.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
mongoose.connect(uri).then(()=>{  
  console.log("mongodb id connected");
  app.listen(3000, () => {
    console.log("Server is listening on port 3000")
  })
}).catch((err)=>{
  console.log("Error: ",err)
})


app.use("/add",studentRegis)
app.use("/teacher",teacher);