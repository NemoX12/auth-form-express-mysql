const dotenv = require("dotenv").config({ path: "./.env" });
const path = require("path");
const express = require("express");
const mysql = require("mysql");

const app = express();

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log(`DB connected succesfully!`);
  }
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});
