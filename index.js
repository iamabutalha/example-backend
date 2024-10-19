import dotenv from "dotenv";
import mongoose, { Mongoose } from "mongoose";
import Note from "./models/notes.js";
import express, { request, response } from "express";
import cors from "cors";
const app = express();
dotenv.config();

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
// const http = require("http");

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
app.use(express.json());
app.use(express.static("dist"));

const unkownPoint = (request, response) => {
  response.status(404).send({ error: "unkown point" });
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformated id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);
app.use(errorHandler);
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (body.content === "undefined") {
    return response.status(400).json({
      error: "content missing",
    });
  } else {
    const note = new Note({
      content: body.content,
      important: Boolean(body.important) || false,
    });

    note
      .save()
      .then((savedNotes) => {
        response.json(savedNotes);
      })
      .catch((error) => {
        next(error);
      });
  }
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // response.status(400).send({ error: "malformated id" });
});

app.delete("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;

  Note.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    note,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNotes) => {
      response.json(updatedNotes);
    })
    .catch((error) => {
      next(error);
    });
});

app.use(unkownPoint);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

/*
-- This code create a new server on HTTP
const app = http.createServer((request, response) => {
  -- the code set the status code to 200 and content type to json
  response.writeHead(200, { "Content-Type": "application/json" });
  -- the notes array will be sent to the server on the port 3001
  response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log("Server running on port ", PORT);

*/
