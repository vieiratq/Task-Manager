const username = localStorage.getItem("username")
const userid = localStorage.getItem("id")
const spanName = document.getElementById("name")
const spanId = document.getElementById("id")
function atualizarNome() {
    spanId.innerText = userid
    spanName.innerText = username
}
atualizarNome()