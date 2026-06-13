const email = document.getElementById("email")
const pass = document.getElementById("pass")
const btn = document.getElementById("buttonstart")
const span = document.getElementById("span1")
function checarboxs(email, pass) {
    if (!email || !pass) {
        span.innerHTML = "por favor complete todas as informações";
        return false
    }
    else {
        return true
    }
}
btn.addEventListener("click", (event) => {
    event.preventDefault();
    if (checarboxs(email.value, pass.value)) {
        fetch("/login", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: pass.value
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem("username", data.name)
                    localStorage.setItem("id", data.id)
                    window.location.href = "/dashboard"
                }
                else
                    span.innerHTML = data.message
            })
    }
})
