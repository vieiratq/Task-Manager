require("dotenv").config();
const taskRoutes = require("./routes/taskRouts");
const express = require("express");
const path = require("path");
const app = express();
const userRoutes1 = require("./routes/userRoutes");
const port = process.env.PORT || 3000;
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const router = require("./routes/userRoutes");
////////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "private")));
app.use(express.static(path.join(__dirname, "frontend")));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


app.get("/dashboard", ValidaLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dash.html"))
});


app.use(express.json());
app.use("/", authRoutes);
app.use("/", userRoutes1);
app.use("/", taskRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


function ValidaLogin(req, res, next) {
  if (req.session.user)
    return next()
  else
    res.redirect("/")
}

