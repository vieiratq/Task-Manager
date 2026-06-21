const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDescription");
const username = document.getElementById("username");
//const email = document.getElementsByName("email");
const plan = document.getElementById("plan");
const level = document.getElementById("level");
const userId = document.getElementById("userId");
const submit = document.getElementById("submit1");
const taskmsg = document.getElementById("taskmsg");
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
submit.addEventListener("click",async (event) => {
    event.preventDefault()
    if(!taskTitle.value || !taskDesc.value){
        taskmsg.innerHTML = "preencha todos os campos"
        return
    }
    if(taskTitle.value.length < 3 || taskTitle.value.length > 25){
        taskmsg.innerHTML = "Titulo deve conter entre 3 e 25 caracteres"
        return
    }
    if(taskDesc.value.length < 3 || taskDesc.value.length > 200){
        taskmsg.innerHTML = "Descricao deve conter entre 3 e 200 caracteres"
        return
    }
    await createTask()
    taskTitle.value = ""
    taskDesc.value = ""
})
loadUser()
