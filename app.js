import mongoose, { Mongoose } from "mongoose";
import Note from "./models/notes.js";
import express, { request, response } from "express";
import * as middleware from "./middleware/middleware.js";
import cors from "cors";
const app = express();
import * as config from "./utils/config.js";
import * as logger from "./utils/logger.js";
import notesRouter from "./controllers/notes.js";
const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("connceted to mongoDb");
  })
  .catch((error) => {
    console.log(error);
  });

mongoose.set("strictQuery", false);

app.use(cors());

app.use(express.json());
app.use(express.static("dist"));

app.use(middleware.requestLogger);
app.use(middleware.errorHandler);
app.use("/api/notes", notesRouter);

app.use(middleware.unkownPoint);

export default app;
