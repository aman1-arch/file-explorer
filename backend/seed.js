const mongoose = require("mongoose");
const Node = require("./models/Node");

const MONGO_URI =
  "mongodb+srv://itsdemon100_db_user:abc123123@cluster0.toiqp3q.mongodb.net/file-explorer?retryWrites=true&w=majority";

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Node.deleteMany({});

  const data = [
    { name: "Documents", type: "folder", parentId: null },
    { name: "Images", type: "folder", parentId: null },
    { name: "Resume.pdf", type: "file", parentId: null }
  ];

  await Node.insertMany(data);

  console.log("Seed data inserted");
  mongoose.disconnect();
}

seed();