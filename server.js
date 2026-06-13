const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose()
const app = express();
const port = 3000;
const db = new sqlite3.Database("./backend/database/Bancodedados.db")
const session = require("express-session");
////////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "private")));
app.use(express.static(path.join(__dirname, "frontend")));
app.use(session({
  secret: "MatadorDePorco1000xFreeFire",
  resave: false,
  saveUninitialized: false
}));
app.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


app.get("/dashboard", ValidaLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "backend", "dashboard", "dash.html"))
})


app.use(express.json());
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "register.html"));
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT id, username, email FROM users WHERE email = ? AND password = ?", [email, password],
    (err, user) => {
      if (err)
        return res.json({ success: false, message: "Erro no login" })
      if (!user)
        return res.json({ success: false, message: "Email ou senha incorreto" })
      if (user)
        req.session.user = { id: user.id, email: user.email, logado: true }
      return res.json({
        success: true,
        message: "usuario ENCONTRADO",
        error: "1",
        id: user.id,
        email: user.email,
        name: user.username
      })
    })

})


app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  db.get("SELECT username, email FROM users WHERE username = ? OR email = ?", [username, email], (err, user) => {
    if (err)
      return res.json({ success: false, message: "erro ao buscar dados" })
    if (user && user.email === email)
      return res.json({ success: false, message: "Email ja cadastrato, use outro email" })
    if (user && user.username === username)
      return res.json({ success: false, message: "username ja cadastrato, use outro username" })
    db.run("INSERT INTO users(username,email,password) VALUES(?,?,?)", [req.body.username, req.body.email, req.body.password], (err) => {
      if (err)
        return res.json({ success: false, message: "erro ao cadastrar" })
      return res.json({ success: true, message: "usuario cadastrado" })
    })

  })


})


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
function ValidaLogin(req, res, next) {
  if (req.session.user)
    return next()
  else
    res.redirect("/")
}
