const userInput = document.getElementById("user")
const emailInput = document.getElementById("email")
const passInput = document.getElementById("pass")
const passInput2 = document.getElementById("pass2")
const enterBtn = document.getElementById("enter")
const span = document.getElementById("spanerror")
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarEmail(emaildigitado) {
    return regex.test(emaildigitado)
}
function checarboxs(email, pass, user) {
    if (!email || !pass || !user) {
        span.innerHTML = "por favor complete todas as informações";
        return false
    }
    else {
        return true
    }
}
enterBtn.addEventListener('click', (event) => {
    event.preventDefault();
    span.innerHTML = " ";
    if (checarboxs(emailInput.value, passInput.value, userInput.value) && validarEmail(emailInput.value))
        if (passInput.value == passInput2.value) {
            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: userInput.value,
                    email: emailInput.value,
                    password: passInput.value
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = "/";
                    } else {
                        span.innerHTML = data.message;
                    }
                });
        }
            else{
                span.innerHTML = "senhas diferentes"
            }
        else
            span.innerHTML = "preencha todos os campos"
})