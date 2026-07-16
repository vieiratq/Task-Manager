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

router.get("/task/get/:search", ValidaLogin, (req, res) => {
   if (req.params.search === "all") {
     db.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [req.session.user.id], (err, result) => {
         if (err) {
             console.log(err)
             return res.json({ success: false, message: "Erro ao buscar tarefas" })
         }
         return res.json({ success: true, tasks: result.rows })
     })
     return
    }
    db.query("SELECT * FROM tasks WHERE user_id = $1 AND (task_title ILIKE $2 OR task_desc ILIKE $2) ORDER BY created_at DESC", [req.session.user.id, `%${req.params.search}%`], (err, result) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "Erro ao buscar tarefas" })
        }
        return res.json({ success: true, tasks: result.rows })
    })
})


router.delete("/task/:id", ValidaLogin, (req, res) => {
    db.query("DELETE FROM tasks WHERE task_id = $1 AND user_id = $2", [req.params.id, req.session.user.id], (err) => {
        if (err) {
            return res.json({ success: false, message: "erro ao excluir tarefa" })
        }
        return res.json({ success: true, message: "Tarefa excluida com sucesso" })
    })
})

router.patch("/task/:id/complete", ValidaLogin, (req, res) => {
    db.query("UPDATE tasks SET completed = TRUE, completed_date = NOW(), completed_by = $1 WHERE task_id = $2 AND user_id = $3", [req.session.user.id, req.params.id, req.session.user.id], (err) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "erro ao atualizar tarefa" })
        }
        return res.json({ success: true, message: "Tarefa atualizada com sucesso" })
    })
})
router.put("/task/edit/:id", ValidaLogin, (req, res) => {
    if (!checktamanho(req.body.task_title, 3, 25)) {
        return res.json({ success: false, message: "Titulo deve conter entre 3 e 25 caracteres" })
    }
    if (!checktamanho(req.body.task_desc, 3, 200)) {
        return res.json({ success: false, message: "Descricao deve conter entre 3 e 200 caracteres" })
    }
    if (req.body.task_title == "" || req.body.task_desc == "") {
        return res.json({ success: false, message: "Titulo e descricao nao podem ser vazios" })
    }
    db.query("UPDATE tasks SET task_title = $1, task_desc = $2 WHERE task_id = $3 AND user_id = $4", [req.body.task_title, req.body.task_desc, req.params.id, req.session.user.id], (err) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "erro ao atualizar tarefa" })
        }
        return res.json({ success: true, message: "Tarefa atualizada com sucesso" })
    })
})

module.exports = router
