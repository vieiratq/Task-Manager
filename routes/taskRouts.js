const express = require("express");
const path = require("path");
const db = require("./databaseroutes");
const router = express.Router();
const checktamanho = require("../function/checktamanho")

function ValidaLogin(req, res, next) {
    if (req.session.user)
        return next()
    else
        res.redirect("/")
}

router.post("/task/post", ValidaLogin, (req, res) => {
    if (!checktamanho(req.body.task_title, 3, 25)) {
        return res.json({ success: false, message: "Titulo deve conter entre 3 e 25 caracteres" })
    }
    if (!checktamanho(req.body.task_desc, 3, 200)) {
        return res.json({ success: false, message: "Descricao deve conter entre 3 e 200 caracteres" })
    }
    db.query("INSERT INTO tasks (user_id,user_name,task_title,task_desc) VALUES ($1,$2,$3,$4)", [req.session.user.id, req.session.user.username, req.body.task_title, req.body.task_desc], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err)
            return res.json({ success: false, message: "Erro ao criar tarefa" })
        }
        return res.json({ success: true, message: "Tarefa criada com sucesso" })
        console.log("foi")

    })
})

router.get("/task/get", ValidaLogin, (req, res) => {

    db.query("SELECT * FROM tasks WHERE user_id = $1", [req.session.user.id], (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Erro ao buscar tarefa" })
        }
        return res.json({ success: true, tasks: result.rows, message: "Tarefa encontrada com sucesso" })
    })
})

router.get("/task/delete/:id", ValidaLogin, (req, res) => {
    db.query("DELETE FROM tasks WHERE task_id = $1 AND user_id = $2", [req.params.id, req.session.user.id], (err) => {
        if (err) {
            return res.json({ success: false, message: "erro ao excluir tarefa" })
        }
        return res.json({ success: true, message: "Tarefa excluida com sucesso" })
    })
})

router.get("/task/complete/:id", ValidaLogin, (req, res) => {
    db.query("UPDATE tasks SET completed = TRUE, completed_date = NOW(), completed_by = $1 WHERE task_id = $2 AND user_id = $3", [req.session.user.id, req.params.id, req.session.user.id], (err) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "erro ao atualizar tarefa" })
        }
        return res.json({ success: true, message: "Tarefa atualizada com sucesso" })
    })
})
router.get("/task/edit/:id", ValidaLogin, (req, res) => {
    db.query
})

module.exports = router