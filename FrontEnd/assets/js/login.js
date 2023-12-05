// Handle form datas
let inputEmail = document.getElementById('email')
let inputPassword = document.getElementById('pass')
let loginForm = document.querySelector('.login-form')
let errorMessageContainer = document.querySelector('.error-message')
let errorMessage = 'Email et/ou mot de passe invalide(s)'


// Validate email function
function validateEmail(userMail) {
    let regexEmail = new RegExp('[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+')
    return regexEmail.test(userMail)
}

// Validate password function
function validatePassword(userPassword) {
    return userPassword !== ""
}

async function redirection (token) {
    window.sessionStorage.setItem('token',token)
}

// Sending datas function
async function sendingDatas(datas) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: datas
    },
    )
    const result = await response.json()
    if (!response.ok) {
        errorMessageContainer.innerText = errorMessage
        throw new Error("Erreur de traitement fetch")
    } else {
        redirection(result.token)
            .then(window.location.href = "./index.html")
    }
    } catch (error) {
        console.error( error)
    }
}

// Validate datas from form and submission
loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let userMail = inputEmail.value
    let userPassword = inputPassword.value

    if (validateEmail(userMail) && validatePassword(userPassword)) {
        errorMessageContainer.innerText = ""
        let data = {
            "email": userMail,
            "password": userPassword
        }
        sendingDatas(JSON.stringify(data))
    } else {
        console.log('error datas form')
        errorMessageContainer.innerText = errorMessage
    }
})

