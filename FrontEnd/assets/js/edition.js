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
let closeModaleBtns = document.querySelector('.close-modale-btn')
let editionGalleryContent = document.querySelector('.gallery-modale')


async function openModal() {
    let editionSpan = document.querySelector('.link-modifier')
    const datas = await getDatas()
    editionSpan.addEventListener('click', () => {
        console.log(datas)
        modaleContainer.style.display = 'flex'
        editionGalleryContent.innerHTML = ""

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
    editionGalleryContent.classList.add('gallery-modale')
    if (returnBtn) {
        document.getElementById('return-btn').remove()
    } 
}

function closeModale() {
    if (returnBtn) {
        document.getElementById('return-btn').remove()
    } 
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
function createInputFile(container) {
    // Create input type file
    let inputFile = document.createElement('input')
    inputFile.type = 'file'
    inputFile.id = "file"
    inputFile.style.display = 'none'
    // Create label for file
    let inputFileLabel = document.createElement('label')
    inputFileLabel.classList.add('input-file')
    inputFileLabel.textContent = "+ Ajouter photo"
    inputFileLabel.setAttribute('for', 'file')
    // add elements to DOM
    container.appendChild(inputFileLabel)
    container.appendChild(inputFile)
}

function createInputText(container) {
    // Create input type text
    let inputTitle = document.createElement('input')
    inputTitle.type = 'text'
    inputTitle.classList.add('input')
    // Create label for input text
    let inputTitleLabel = document.createElement('label')
    inputTitleLabel.textContent = "Titre"
    // add elements to DOM
    container.appendChild(inputTitleLabel)
    container.appendChild(inputTitle)
}

function createSelectElement(container) {
    // Create select element
    let selectElement = document.createElement('select')
    selectElement.classList.add('input')
    let selectLabel = document.createElement('label')
    selectLabel.id = 'select-category'
    selectLabel.textContent = 'Catégorie'
    container.appendChild(selectLabel)
    container.appendChild(selectElement)
    // set options from datas

}

let form
function createFormAddWord() {
    form = document.createElement('form')
    let inputFileContainer = document.createElement('div')
    inputFileContainer.classList.add('inputContainer')

    let acceptedText = document.createElement('p')
    acceptedText.classList.add('acceptedText')
    acceptedText.textContent = 'jpg, png : 4mo max'
    
    inputFileContainer.innerHTML += '<i class="fa-regular fa-image fa-2xl"></i>'
    createInputFile(inputFileContainer)
    inputFileContainer.appendChild(acceptedText)

    form.classList.add('formAddWorks')
    form.appendChild(inputFileContainer)
    createInputText(form)
    createSelectElement(form)
    editionGalleryContent.appendChild(form)
}

let returnBtn
async function createReturnButton(container) {
    returnBtn = document.createElement('div')
    returnBtn.id = 'return-btn'
    returnBtn.classList.add('return-btn')
    returnBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`
    container.prepend(returnBtn)
    returnBtn.addEventListener('click', () => {
        console.log(datas)
        editionGalleryContent.innerHTML = ""
        editionGalleryContent.classList.add('gallery-modale')
        closeModaleBtns.classList.remove('spaceBetween')
        container.removeChild(container.firstElementChild)
        generateGalleryContent(datas)
    })
    const datas = await getDatas()
}

function addWork() {
    let addWorkBtn = document.querySelector('.add-photo-btn')
    addWorkBtn.addEventListener('click', () => {
        editionGalleryContent.innerHTML = ""
        editionGalleryContent.classList.remove('gallery-modale')
         createReturnButton(closeModaleBtns)
        closeModaleBtns.classList.add('spaceBetween')
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
