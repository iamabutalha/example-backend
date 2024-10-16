import { useState, useEffect } from "react";
import Note from "./components/Note.jsx";
import axios from "axios";
import NoteServices from "./services/notes.js";
import Notification from "./components/Notification.jsx";

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science University of Helsinki 2024
      </em>
    </div>
  );
};
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNotes, setNewNotes] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // This is an array which will show all the notes if showAll in state is true or vice versa
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  console.log(notesToShow);

  useEffect(() => {
    console.log("effect");
    NoteServices.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  console.log("render", notes.length, "notes");
  if (!notes) {
    return null;
  }

  const addNotes = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNotes,
      important: Math.random() < 0.5,
      // id: String(notes.length + 1),
    };
    //   setNotes(notes.concat(noteObject));
    //   setNewNotes("");
    //   console.log("Button clicked", event.target);

    NoteServices.create(noteObject).then((returnedNote) => {
      console.log("response from post", returnedNote);
      setNotes(notes.concat(returnedNote));
      setNewNotes("");
    });
  };

  const toggleImportance = (id) => {
    console.log("importance of " + id + " need to be toggled");
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    NoteServices.update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        alert(
          `The content ${note.content} was already deleted from the server`
        );
        setErrorMessage("Some error happened...");
        setTimeout(() => setErrorMessage(null), 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleNoteChange = (event) => {
    console.log("Button clicked", event.target.value);
    setNewNotes(event.target.value);
  };
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNotes}>
        <input
          value={newNotes}
          onChange={handleNoteChange}
          placeholder="Enter something"
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
