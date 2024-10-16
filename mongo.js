import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb://fullstackopen:${password}@cluster0-shard-00-00.ezckl.mongodb.net:27017/noteApp?ssl=true&replicaSet=atlas-12fr2m-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML IS EASY",
  important: true,
});
// note.save().then((result) => {
//   console.log("note saved");
//   mongoose.connection.close();
// });

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
