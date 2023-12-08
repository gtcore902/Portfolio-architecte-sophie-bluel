import { getDatas } from './main.js';

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
    let spanModifier = document.createElement('span')
    spanModifier.classList.add('span-modifier')
    spanModifier.innerHTML = `
       <i class="fa-regular fa-pen-to-square"></i>
        <span class="span-edition">Modifier</span>
        `
    titleProjects.appendChild(spanModifier)
}

// Set modale system
let wrapperModale = document.querySelector('.wrapper-modale')
let displayGallery = document.getElementById('display-gallery')
// close display grid modale on click
wrapperModale.addEventListener('click', () => {
    document.querySelector('.grid-photo').innerHTML = ""
    wrapperModale.classList.toggle('visible')
})
displayGallery.addEventListener('click', (event) => {
    event.stopPropagation()
})

async function openModal() {
    const datas = await getDatas()
    let editionSpan = document.querySelector('.span-modifier')
    editionSpan.addEventListener('click', () => {
        wrapperModale.classList.toggle('visible')
        generateDisplayGallery()
    })
}

// Function for close display grid modale
function closeDisplayGridModale() {
    let triggerBtn = document.querySelector('.close-btn')
    triggerBtn.addEventListener('click', () => {
        console.log('click')
        document.querySelector('.grid-photo').innerHTML = ""
        wrapperModale.classList.toggle('visible')
    })
}


// function for generate display gallery
async function generateDisplayGallery() {
    const datas = await getDatas()
    for (const element of datas) {
        let imgGridContainer = document.createElement('div')
        imgGridContainer.classList.add('img-grid-container')
        let imgGridElement = document.createElement('img')
        imgGridElement.src = element.imageUrl
        imgGridElement.classList.add('grid-photo-img')
        let iconContainer = document.createElement('div')
        iconContainer.classList.add('icon-container')
        iconContainer.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
        // console.log(imgGridElement)
        imgGridContainer.appendChild(imgGridElement)
        imgGridContainer.appendChild(iconContainer)
        let gridContainer = document.querySelector('.grid-photo')
        gridContainer.appendChild(imgGridContainer)
    }
}




// Check if token exists in local storage
if (window.sessionStorage.getItem('token')) {
    createEditionBar()
    setHrefButton()
    editionModeButton()
    openModal()
    closeDisplayGridModale()
}
