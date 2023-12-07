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
    let spanModifier = document.createElement('a')
    spanModifier.classList.add('link-modifier')
    spanModifier.innerHTML = `
       <i class="fa-regular fa-pen-to-square"></i>
        <span class="span-edition">Modifier</span>
        `
    titleProjects.appendChild(spanModifier)
}

// Set modale system
let modaleContainer = document.querySelector('.modale-container')
let modaleContent = document.querySelector('.modale-content')
let editionGalleryContent = document.querySelector('.gallery-modale')


async function openModal() {
    let editionSpan = document.querySelector('.link-modifier')
    const datas = await getDatas()
    editionSpan.addEventListener('click', () => {
        console.log(datas)
        modaleContainer.style.display = 'flex'
        // code gallery content
        generateGalleryContent(datas)
    })
    modaleContent.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

// Reset gallery modal content and display none
function resetModale() {
    modaleContainer.style.display = 'none'
    editionGalleryContent.innerHTML = ""
}

function closeModale() {
    modaleContainer.addEventListener('click', () => resetModale())
    let closeModaleBtn = document.querySelector('.closeModal')
    closeModaleBtn.addEventListener('click', () => resetModale())
}

// function gallery content
function generateGalleryContent(datas) {
    for (let i = 0; i < datas.length; i++) {
        let contentImg = document.createElement('div')
        contentImg.classList.add('element-container')
        let imgTag = document.createElement('img')
        let deleteBtn = document.createElement('div')
        deleteBtn.classList.add('delete-btn')
        deleteBtn.id = datas[i].id
        deleteBtn.innerHTML = `<i id=${datas[i].id} class="fa-solid fa-trash-can fa-xs"></i>`
        imgTag.src = datas[i].imageUrl
        imgTag.classList.add('edition-gallery-img')
        contentImg.appendChild(imgTag)
        contentImg.appendChild(deleteBtn)
        editionGalleryContent.appendChild(contentImg)
        // console.log(imgTag)
        deleteBtnClick()
    }
}

// Listener for delete work
function deleteBtnClick () {
    let deleteBtn = document.querySelectorAll('.delete-btn')
    let workId = ""
    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', (event) => {
            // Get id of the element that was clicked
            event.target.id === "" ? workId = event.target.parentNode.id : null
            event.target.id !== "" ? workId = event.target.id : null
            deleteWork(workId)
        })
    }
}

// Function to delete element
function deleteWork(workId) {
    console.log('Id : ' + workId)
    // fetch
}


// // Function to add works
// Create form to add work
let form
function createFormAddWord() {
    form = document.createElement('form')
    let inputFileContainer = document.createElement('div')
    let inputFileLabel = document.createElement('label')
    let inputFile = document.createElement('input')
    inputFile.type = 'file'
    inputFileContainer.appendChild(inputFileLabel)
    inputFileContainer.appendChild(inputFile)
    let inputTitle = document.createElement('input')
    inputTitle.type = 'text'
    form.appendChild(inputFileContainer)
    form.appendChild(inputTitle)
    editionGalleryContent.appendChild(form)
    // return form
}

function addWork() {
    let addWorkBtn = document.querySelector('.add-photo-btn')
    addWorkBtn.addEventListener('click', () => {
        editionGalleryContent.innerHTML = ""
        editionGalleryContent.style.display = 'flex'
        createFormAddWord()
        let modaleTitle = document.querySelector('.modale-title')
        modaleTitle.innerText = "Ajout photo"
        
    })
}



// Check if token exists in local storage
if (window.sessionStorage.getItem('token')) {
    createEditionBar()
    setHrefButton()
    editionModeButton()
    openModal()
    closeModale()
    addWork()
}
