const bcrypt = require("bcrypt")
const express = require("express");
const path = require("path");
const db = require("./databaseroutes");
const router = express.Router();
const checktamanho = require("../function/checktamanho")
const rateLimit = require("express-rate-limit")
const loginLimiter = rateLimit({
  windowMs: 1000 * 60 * 60,
  limit: 5,
  message: {
    success: false,
    message: "Muitas tentativas de login. Tente novamente em 1 hora."
  }
})
function ValidaLogin(req, res, next) {
  if (req.session.user)
    return next()
  else
    res.redirect("/")
}
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!checktamanho(username, 5, 20))
    return res.json({ success: false, message: "username deve conter entre 5 e 20 caracteres" })
  if (!checktamanho(password, 6, 25))
    return res.json({ success: false, message: "password deve conter entre 6 e 25 caracteres" })
  if (!checktamanho(email, 5, 50))
    return res.json({ success: false, message: "email deve conter entre 5 e 50 caracteres" })

  db.query("SELECT username, email FROM users WHERE username = $1 OR email = $2", [username, email], async (err, result) => {
    if (err)
      return res.json({ success: false, message: "erro ao buscar dados" })
    const user = result.rows[0]
    if (user && user.email === email)
      return res.json({ success: false, message: "Email ja cadastrato, use outro email" })
    if (user && user.username === username)
      return res.json({ success: false, message: "username ja cadastrato, use outro username" })
    const passHash = await bcrypt.hash(req.body.password, 10);
    db.query("INSERT INTO users(username,email,password) VALUES($1,$2,$3)", [req.body.username, req.body.email, passHash], (err) => {
      if (err)
        return res.json({ success: false, message: "erro ao cadastrar" })
      return res.json({ success: true, message: "usuario cadastrado" }), console.log("usuario cadastrado com sucesso" + username + " " + email + ' ' + password)
    })

  })


})


router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT id, username, email, password FROM users WHERE email = $1", [email],
    async (err, result) => {

      if (err)
        return res.json({ success: false, message: "Erro no login" })
      const user = result.rows[0]
      if (!user)
        return res.json({ success: false, message: "email ou senha incorreto", error: "222" })
      const loginCheck = await bcrypt.compare(password, user.password)
      if (!loginCheck)
        return res.json({ success: false, message: "Email ou senha incorreto" })
      if (loginCheck) {
        req.session.user = { id: user.id, email: user.email, logado: true, username: user.username }, console.log("usuario Logado com sucesso " + email + " " + password)
      }
      return res.json({
        success: true,
        message: "usuario ENCONTRADO",
        error: "1",
        id: user.id,
        email: user.email,
        username: user.username
      })
    })

})

router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "register.html"));
});

module.exports = router;