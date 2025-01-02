import express from "express";
import "dotenv/config";
import connectDB from "./db/connectDB.js";

const app = express();
const port = process.env.PORT || 80;

// Connect to MongoDB
const DB_URL = process.env.MONGODB_URI;
connectDB(DB_URL);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
