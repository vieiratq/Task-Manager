const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDescription");
const username = document.getElementById("username");
//const email = document.getElementsByName("email");
const plan = document.getElementById("plan");
const level = document.getElementById("level");
const userId = document.getElementById("userId");
const submit = document.getElementById("submit1");
const taskmsg = document.getElementById("taskmsg");
const tasks = document.getElementById("tasksList");
const atualizar = document.getElementById("atualizar");
const taskSpan = document.getElementById("taskSpan");
//const taskDelete = document.getElementById("task-delete")

let enviando = false
function criarCompleteBtn(taskDiv) {
    const completeButton = taskDiv.querySelector(".task-complete")
    if (completeButton) {
        completeButton.addEventListener("click", async (event) => {
            if (completeButton.dataset.id) {
                completeTask(event, completeButton.dataset.id)
            }
        })
    }
}
function criarDeleteBtn(taskDiv) {
    const deleteButton = taskDiv.querySelector(".task-delete")
    if (deleteButton) {
        deleteButton.addEventListener("click", async (event) => {
            deletarTask(event, deleteButton.dataset.id)
        })
    }
}
async function completeTask(event, buttonid) {
    event.preventDefault()
    const responde = await fetch(`/task/complete/${buttonid}`)
    const data = await responde.json()
    taskSpan.innerHTML = data.message
    await loadTasks()
}
async function loadUser() {
    const response = await fetch("/api/users");
    try {
        if (!response.ok) {
            console.log("not okay")
            return window.location.href = "/"
        }
        const user = await response.json()
        username.innerHTML = user.username
        //email.innerText = user.email
        level.innerText = user.level
        plan.innerText = user.plan
        userId.innerText = user.id
        console.log(user)
    }
    catch (error) {
        console.log(error)
        window.location.href = "/"

    }

}

async function createTask() {
    const responseCheck = await fetch("/api/users");
    try {
        if (!responseCheck.ok) {
            console.log("not okay")
            return window.location.href = "/"
        }
    }
    catch (error) {
        console.log(error)
        window.location.href = "/"

    }
    const user = await responseCheck.json()
    const response = await fetch("/task/post", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user_id: user.id,
            user_name: user.username,
            task_title: taskTitle.value,
            task_desc: taskDesc.value
        }),
    })
    const data = await response.json()
    taskmsg.innerHTML = data.message
    console.log(data)

}

submit.addEventListener("click", async (event) => {
    event.preventDefault()
    if (!taskTitle.value || !taskDesc.value) {
        taskmsg.innerHTML = "Preencha todos os campos"
        return
    }
    if (taskTitle.value.length < 3 || taskTitle.value.length > 25) {
        taskmsg.innerHTML = "Titulo deve conter entre 3 e 25 caracteres"
        return
    }
    if (taskDesc.value.length < 3 || taskDesc.value.length > 200) {
        taskmsg.innerHTML = "Descricao deve conter entre 3 e 200 caracteres"
        return
    }
    if (enviando) return
    enviando = true
    submit.innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>'
    submit.disabled = true
    try {
        await createTask()
        taskTitle.value = ""
        taskDesc.value = ""
    }
    finally {
        enviando = false
        submit.innerHTML = '<i class="fa-solid fa-plus"></i><span>Criar tarefa</span>'
        submit.disabled = false
        loadTasks()
    }

})


async function loadTasks() {
    const response = await fetch("/task/get")
    const data = await response.json()
    const tasks = data.tasks
    tasksList.innerHTML = ""
    tasks.forEach(task => {
        const taskDiv = document.createElement("div")
        taskDiv.className = task.completed ? "task completed" : "task"
        if (task.user_id == userId.innerText) {
            if (task.completed == false) {
                taskDiv.innerHTML = `
                 <div class="task-title">${task.task_title}
                  <div class="task-actions">
                <button data-id=${task.task_id} class="task-complete">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button data-id= "${task.task_id}" class="task-delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button class="task-edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                     </div>
                   </div>
                               <div class="task-desc">${task.task_desc}</div>
                       <div class="task-meta">
                       <span class="task-user">${task.user_name}</span>
                       <span class="task-date">${new Date(task.created_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div class="task-id" data-id= "${task.task_id}">Task #${task.task_id}</div>
                         `
                criarDeleteBtn(taskDiv)
                criarCompleteBtn(taskDiv)
                tasksList.appendChild(taskDiv)
            }
            else {
                taskDiv.innerHTML = `
                 <div class="task-title">${task.task_title}
                  <div class="task-actions">
                    <button data-id= "${task.task_id}" class="task-delete">
                       <i class="fa-solid fa-trash"></i>
                   </button>
                  </div>
                 </div>
                  <div class="task-desc">${task.task_desc}</div>
                  <div class="task-meta">
                       <span class="task-user">${task.user_name}</span>
                    <span class="task-date">${new Date(task.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                          <div class="task-id" data-id= "${task.task_id}">Task #${task.task_id}</div>
                      `
                    criarDeleteBtn(taskDiv)
                    tasksList.appendChild(taskDiv)
            }
        }
        else {
            taskDiv.innerHTML = `
        <div class="task-title">${task.task_title}</div>
        <div class="task-desc">${task.task_desc}</div>
        <div class="task-meta">
            <span class="task-user">${task.user_name}</span>
            <span class="task-date">${new Date(task.created_at).toLocaleDateString("pt-BR")}</span>
        </div>
        <div class="task-id">Task #${task.task_id}</div>
        `
            criarDeleteBtn(taskDiv)
            tasksList.appendChild(taskDiv)
        }

    });
}

atualizar.addEventListener("click", () => {
    tasksList.innerHTML =`
    <div class="loading">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
    </div>
    `
    loadTasks()
})

async function deletarTask(event, buttonid) {
    event.preventDefault()
    const response = await fetch(`/task/delete/${buttonid}`)
    const data = await response.json()
    taskSpan.innerHTML = data.message
    await loadTasks()
}



async function init() {
    await loadUser()
    await loadTasks()

}
init()
