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
const editMenu = document.querySelector(".editMenu")
const searchInput = document.getElementById("searchInput")
const status = document.getElementById("status")
const closeEditMenu = document.getElementById("closeEditMenu")
const taskTitleEdit = document.getElementById("taskTitleEdit")
const taskDescriptionEdit = document.getElementById("taskDescriptionEdit")
const submit2 = document.getElementById("submit2")
const taskmsg2 = document.getElementById("taskmsg2")
let enviando = false
let taskEditandoId = null

function criarIcone(className) {
    const icon = document.createElement("i")
    icon.className = className
    return icon
}

async function criarEditBtn(taskDiv) {
    const editButton = taskDiv.querySelector(".task-edit")

    if (editButton) {
        editButton.addEventListener("click", async (event) => {
            event.preventDefault()
            taskEditandoId = editButton.dataset.id
            editMenu.classList.add("active")
        })
        closeEditMenu.addEventListener("click", () => {
            editMenu.classList.remove("active")
        })
    }
}

submit2.addEventListener("click", async (event) => {
    event.preventDefault()
    if (!taskTitleEdit.value || !taskDescriptionEdit.value) {
        taskmsg2.textContent = "Preencha todos os campos"
        return
    }
    if (taskTitleEdit.value.length < 3 || taskTitleEdit.value.length > 25) {
        taskmsg2.textContent = "Titulo deve conter entre 3 e 25 caracteres"
        return
    }
    if (taskDescriptionEdit.value.length < 3 || taskDescriptionEdit.value.length > 200) {
        taskmsg2.textContent = "Descricao deve conter entre 3 e 200 caracteres"
        return
    }
    if (taskTitle.value.length > 25) {
        taskmsg2.textContent = "Titulo deve conter entre 3 e 25 caracteres"
        return
    }
    const response = await fetch(`/task/edit/${taskEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task_title: taskTitleEdit.value,
            task_desc: taskDescriptionEdit.value,
        })
    })
    const data = await response.json()
    taskmsg2.textContent = data.message
    editMenu.classList.remove("active")
    await loadTasks()
})


function criarCompleteBtn(taskDiv) {
    const closeEditMenu = document.querySelector(".closeEditMenu")
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
    const responde = await fetch(`/task/${buttonid}/complete`, {
        method: "PATCH"
    })
    const data = await responde.json()
    taskSpan.textContent = data.message
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
        username.textContent = user.username
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
            task_title: taskTitle.value,
            task_desc: taskDesc.value
        }),
    })
    const data = await response.json()
    taskmsg.textContent = data.message
    console.log(data)

}

submit.addEventListener("click", async (event) => {
    event.preventDefault()
    if (!taskTitle.value || !taskDesc.value) {
        taskmsg.textContent = "Preencha todos os campos"
        return
    }
    if (taskTitle.value.length < 3 || taskTitle.value.length > 25) {
        taskmsg.textContent = "Titulo deve conter entre 3 e 25 caracteres"
        return
    }
    if (taskDesc.value.length < 3 || taskDesc.value.length > 200) {
        taskmsg.textContent = "Descricao deve conter entre 3 e 200 caracteres"
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
    tasksList.textContent = ""
    tasks.forEach(task => {
        const taskDiv = document.createElement("div")
        taskDiv.className = task.completed ? "task completed" : "task"
        if (task.user_id == userId.innerText) {
            if (task.completed == false) {
                taskDiv.innerHTML = `
                 <div class="task-title">
                  <div class="task-actions">
                <button class="task-complete">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="task-delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button class="task-edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                     </div>
                   </div>
                               <div class="task-desc"></div>
                       <div class="task-meta">
                       <span class="task-user"></span>
                       <span class="task-date"></span>
                          </div>
                          <div class="task-id"></div>
                         `
                preencherTask(taskDiv, task)
                criarDeleteBtn(taskDiv)
                criarCompleteBtn(taskDiv)
                criarEditBtn(taskDiv)
                tasksList.appendChild(taskDiv)
            }
            else {
                taskDiv.innerHTML = `
                 <div class="task-title">
                  <div class="task-actions">
                    <button class="task-delete">
                       <i class="fa-solid fa-trash"></i>
                   </button>
                  </div>
                 </div>
                  <div class="task-desc"></div>
                  <div class="task-meta">
                       <span class="task-user"></span>
                    <span class="task-date"></span>
                  </div>
                          <div class="task-id"></div>
                      `
                preencherTask(taskDiv, task)
                criarDeleteBtn(taskDiv)
                tasksList.appendChild(taskDiv)
            }
        }
        else {
            taskDiv.innerHTML = `
        <div class="task-title"></div>
        <div class="task-desc"></div>
        <div class="task-meta">
            <span class="task-user"></span>
            <span class="task-date"></span>
        </div>
        <div class="task-id"></div>
        `
            preencherTask(taskDiv, task)
            criarDeleteBtn(taskDiv)
            tasksList.appendChild(taskDiv)
        }

    });
}

function preencherTask(taskDiv, task) {
    const taskTitleDiv = taskDiv.querySelector(".task-title")
    const taskActions = taskDiv.querySelector(".task-actions")
    taskTitleDiv.insertBefore(document.createTextNode(task.task_title), taskActions)

    taskDiv.querySelector(".task-desc").textContent = task.task_desc
    taskDiv.querySelector(".task-user").textContent = task.user_name
    taskDiv.querySelector(".task-date").textContent = new Date(task.created_at).toLocaleDateString("pt-BR")

    const taskId = taskDiv.querySelector(".task-id")
    taskId.dataset.id = task.task_id
    taskId.textContent = `Task #${task.task_id}`

    const completeButton = taskDiv.querySelector(".task-complete")
    if (completeButton) completeButton.dataset.id = task.task_id

    const deleteButton = taskDiv.querySelector(".task-delete")
    if (deleteButton) deleteButton.dataset.id = task.task_id

    const editButton = taskDiv.querySelector(".task-edit")
    if (editButton) editButton.dataset.id = task.task_id
}

atualizar.addEventListener("click", () => {
    const loading = document.createElement("div")
    loading.className = "loading"
    loading.appendChild(criarIcone("fa-solid fa-circle-notch fa-spin"))
    tasksList.replaceChildren(loading)
    loadTasks()
})

async function deletarTask(event, buttonid) {
    event.preventDefault()
    const response = await fetch(`/task/${buttonid}`, {
        method: "DELETE"
    })
    const data = await response.json()
    taskSpan.textContent = data.message
    await loadTasks()
}



async function init() {
    await loadUser()
    await loadTasks()

}
init()
