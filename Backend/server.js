


// // server.js
// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import mongoose from "mongoose";
// import chatRoutes from "./routes/chat.js";

// const app = express();
// const PORT = 8080;

// app.use(express.json());
// app.use(cors());

// app.use("/api", chatRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`);
//   connectDB();
// });

// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("Connected with database");
//   } catch (err) {
//     console.log("Failed to connect with database", err);
//   }
// }






// server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();

// Use environment PORT (Render) or fallback for local dev
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // optional recommended mongoose options
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected with database");
  } catch (err) {
    console.error("Failed to connect with database", err);
    // exit if DB is required to run
    process.exit(1);
  }
}

// connect DB first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});

// handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received: closing server");
  mongoose.connection.close(false, () => {
    console.log("Mongo connection closed");
    process.exit(0);
  });
});
