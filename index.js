import express, { request, response } from "express";
import cors from "cors";
const app = express();

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

app.use(express.static("dist"));

const unkownPoint = (request, response) => {
  response.status(404).send({ error: "unkown point" });
};

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("---");
  next();
};

app.use(express.json());
app.use(requestLogger);

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);
  console.log(note);
  response.json(note);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => id === note.id);
  //   if not avialbale show it
  if (note) {
    response.json(note);
  } else {
    // if not respond with 404 not found

    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;

  const note = notes.filter((note) => id !== note.id);
  response.status(204).end();
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
