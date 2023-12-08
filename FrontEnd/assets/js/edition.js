import { getDatas } from './main.js';
import { gallery } from './main.js';
import displayGallery from './main.js';

/**
 * Create edition bar
 */
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

/**
 * Set a href button to logout
 */
function setHrefButton() {
    let loginHref = document.querySelector('.login-href')
    loginHref.textContent = "logout"
    loginHref.href = ""
    loginHref.addEventListener('click', () => {
        logout()
    })
}

/**
 * Logout function
 */
function logout() {
    window.sessionStorage.removeItem('token')
}

/**
 * Set mode edition on index.html
 */
function editionModeButton() {
    // Display none filters buttons
    let elementContainer = document.querySelector('.filters')
    elementContainer.style.display = 'none'
    // Create new element to trigger
    let titleProjects = document.querySelector('.title-projects')
    titleProjects.style.marginBottom = "51px"
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


/**
 * open modale on click and display gallery on modale
 */
async function openModal() {
    const datas = await getDatas()
    let editionSpan = document.querySelector('.link-modifier')
    editionGalleryContent.innerHTML = ""
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

/**
 * Reset gallery modal content and display none and reinit openModal()
 */
function resetModale() {
    resetAddWorkBtnBehavior(document.querySelector('.add-photo-btn'))
    modaleContainer.style.display = 'none'
    editionGalleryContent.innerHTML = ""
    editionGalleryContent.classList.add('gallery-modale')
    closeModaleBtns.classList.remove('spaceBetween')
    if (returnBtn) {
        document.getElementById('return-btn').remove()
    } 
    openModal()
}


function closeModale() {
    resetAddWorkBtnBehavior(document.querySelector('.add-photo-btn'))
    closeModaleBtns.classList.remove('spaceBetween')
    if (returnBtn) {
        document.getElementById('return-btn').remove()
    } 
    modaleContainer.addEventListener('click', () => resetModale())
    let closeModaleBtn = document.querySelector('.closeModal')
    closeModaleBtn.addEventListener('click', () => resetModale())
    openModal()
}

// function gallery content
async function generateGalleryContent(datas) {
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
        deleteBtnClick()
    }
}

// Listener for delete work
let workId = ""
async function deleteBtnClick () {
    let deleteBtn = document.querySelectorAll('.delete-btn')
    for (let element of deleteBtn) {
        element.addEventListener('click', (event) => {
            // Get id of the element that was clicked
            event.target.id === "" ? workId = event.target.parentNode.id : null
            event.target.id !== "" ? workId = event.target.id : null
            deleteWork(workId) 
            .then(workId = "")
        })
    }
}

/**
 * Function to delete element
 * @param {number} workId 
 */
async function deleteWork(workId) {
    const token = window.sessionStorage.getItem('token')
    let datas
    // fetch
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
        }).then(datas = await getDatas())
            .then(editionGalleryContent.innerHTML = "")
                .then(generateGalleryContent(datas))
                    .then(gallery.innerHTML = "")
                        .then(displayGallery(datas))
        if (response.status === 404) {
            throw new Error('401, Unauthorized')
        }
        if (response.status === 500) {
            throw new Error('500, Internal servor error')
        }
            
    } catch (error) {
        console.log('Error: ', error)
    }
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

/**
 * Fetch function to get categories from API
 * @returns {Promise<{id: number, name: string}[]>} ids and names of categories
 */
async function getCategoriesId() {
    const response = await fetch('http://localhost:5678/api/categories')
    // Handle error
    try {
        if (response.status === 404) {
            throw new Error('404, Page not found')
        }
        if (response.status === 500) {
            throw new Error('500, Internal servor error')
        }
        let categoriesId = await response.json()
        console.log(categoriesId)
        return categoriesId
    } catch (error) {
        console.error(error)
    }
}


async function createSelectElement(container) {
    // Create select element
    let selectElement = document.createElement('select')
    selectElement.classList.add('input')
    let selectLabel = document.createElement('label')
    selectLabel.id = 'select-category'
    selectLabel.textContent = 'Catégorie'
    let defaultOption = document.createElement('option')
    selectElement.appendChild(defaultOption)
    container.appendChild(selectLabel)
    container.appendChild(selectElement)
    const categoriesId = await getCategoriesId()
    console.log(categoriesId)
    for (const element of categoriesId) {
        let option = document.createElement('option')
        option.value = element.name
        option.textContent = element.name
        selectElement.appendChild(option)
    }
}

let form
function createFormAddWord() {
    form = document.createElement('form')
    let inputFileContainer = document.createElement('div')
    inputFileContainer.classList.add('inputContainer')

    let acceptedText = document.createElement('p')
    acceptedText.classList.add('acceptedText')
    acceptedText.textContent = 'jpg, png : 4mo max'
    
    let backgroundImg = document.createElement('img')
    backgroundImg.src = '../FrontEnd/assets/icons/bcc-img-form.png'
    inputFileContainer.appendChild(backgroundImg)
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
        document.querySelector('.modale-title').textContent = "Galerie photo"
        resetAddWorkBtnBehavior(document.querySelector('.add-photo-btn'))

    })
    const datas = await getDatas() // check if necessary !!
}

function setAddWorkBtnBehavior(element) {
    element.textContent = "Valider"
    element.classList.add('disabled')
    element.disabled = true
}

function resetAddWorkBtnBehavior(element) {
    element.textContent = "Ajouter une photo"
    element.classList.remove('disabled')
    element.disabled = false
}

let modaleTitle
function addWork() {
    let addWorkBtn = document.querySelector('.add-photo-btn')
    addWorkBtn.addEventListener('click', () => {
        editionGalleryContent.innerHTML = ""
        editionGalleryContent.classList.remove('gallery-modale')
        createReturnButton(closeModaleBtns)
        closeModaleBtns.classList.add('spaceBetween')
        createFormAddWord()
        modaleTitle = document.querySelector('.modale-title')
        modaleTitle.innerText = "Ajout photo"
        setAddWorkBtnBehavior(addWorkBtn)
    })
}



// Check if token exists in local storage and launch admin functions
if (window.sessionStorage.getItem('token')) {
    createEditionBar()
    setHrefButton()
    editionModeButton()
    openModal()
    closeModale()
    addWork()
    // deleteWork(workId)
}
