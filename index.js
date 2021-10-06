// installing modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//.
const app = express();

const port = 3000;

app.use(cookieParser());
app.use(cors());

app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

app.set("view engine", "ejs");
// connecting to mongoDB
// usersdb is the database name
mongoose.connect("mongodb://localhost/usersdb", {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database Connected");
});

app.get("/", (req, res) => {
  res.render("index.html");
});

app.use("/uploads", express.static("uploads"));
app.use(express.static("uploads"));
app.use(express.json());

const userrouter = require("./routes/user");
app.use("/user", userrouter);

// starting server
app.listen(port, () => {
  console.log(`connected to the port ${port}`);
});
