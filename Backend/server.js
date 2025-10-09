
// // // server.js

// import express, { json } from "express";
// import "dotenv/config";
// import cors from "cors";
// import mongoose from "mongoose";
// import chatRoutes from "./routes/chat.js"

// const app = express();
// const PORT = 8080; 

// app.use(express.json());
// app.use(cors());

// app.use("/api",chatRoutes);


// app.listen(PORT,()=>{
//   console.log(`Server is running on ${PORT}`);
//   connectDB();
// })
 
// const connectDB=async()=>{
//   try{
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("Connected with database");
//   }catch(err){
//     console.log("Failed to connect with database",err);
//   }

// }



// server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with database");
  } catch (err) {
    console.log("Failed to connect with database", err);
  }
}



