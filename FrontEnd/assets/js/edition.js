// Create edition bar
function createEditionBar() {
    let editionModeBar = document.createElement('div');
    let mainHeader = document.querySelector('.main-header')
    mainHeader.style.marginTop = "109px"
    editionModeBar.classList.add('editionMode-bar')
    editionModeBar.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <span class="span-edition">Mode édition</span>
    `
    document.body.prepend(editionModeBar)
}

// Set a href button
function setHrefButton() {
    let loginHref = document.querySelector('.login-href')
    loginHref.textContent = "logout"
    loginHref.href = ""
    loginHref.addEventListener('click', () => {
        logout()
    })
}

// Logout function
function logout() {
    window.sessionStorage.removeItem('token')
}

// Set edition system button
function editionModeButton() {
    // Display none filters buttons
    let elementContainer = document.querySelector('.filters')
    elementContainer.style.display = 'none'
    // Create element modify
    let titleProjects = document.querySelector('.title-projects')
    titleProjects.style.marginBottom = "51px"
    // console.log(titleProjects)
    let spanModifier = document.createElement('a')
    spanModifier.classList.add('link-modifier')
    spanModifier.innerHTML = `
       <i class="fa-regular fa-pen-to-square"></i>
        <span class="span-edition">Modifier</span>
        `
    titleProjects.appendChild(spanModifier)
}

// Set modale system
function openModal() {
    let editionSpan = document.querySelector('.span-modifier')
    editionSpan.addEventListener('click', () => {
        // console.log('ok')
    })
}

// Check if token exists in local storage
if (window.sessionStorage.getItem('token')) {
    createEditionBar()
    setHrefButton()
    editionModeButton()
    openModal()
}
