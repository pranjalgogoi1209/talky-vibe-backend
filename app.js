import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db/connectDB.js";

import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 80;

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const DB_URL = process.env.MONGODB_URI;
connectDB(DB_URL);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
