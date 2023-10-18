const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  console.log(name, email, password, passwordConfirm);

  let sql = `SELECT email FROM users WHERE email = ?`;
  db.query(
    `SELECT email FROM users WHERE email = ?`,
    [email],
    async (err, resp) => {
      if (err) {
        console.error(err);
      }

      if (resp.length > 0) {
        return res.render("register", {
          message: "That email is already registred",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password aren't the same",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        `INSERT INTO users SET ?`,
        {
          name: name,
          email: email,
          password: hashedPassword,
        },
        (err, resp) => {
          if (err) {
            console.error(err);
          } else {
            console.log(resp);
            return res.render("register", {
              message: "User registered",
            });
          }
        }
      );
    }
  );
};
