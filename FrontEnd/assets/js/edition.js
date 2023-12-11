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
        // console.log(categoriesId)
        return categoriesId
    } catch (error) {
        console.error(error)
    }
}

// Create form to add work
function createInputFile(container) {
    // Create input type file
    let inputFile = document.createElement('input')
    inputFile.type = 'file'
    inputFile.id = "file"
    inputFile.setAttribute('name', 'file')
    inputFile.setAttribute('accept', 'image/png, image/jpeg')
    inputFile.style.opacity = 0 // Check here
    // inputFile.style.display = 'none'
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
    inputTitle.name = 'title'
    inputTitle.id = 'title'
    // Create label for input text
    let inputTitleLabel = document.createElement('label')
    inputTitleLabel.textContent = "Titre"
    inputTitleLabel.setAttribute('for', 'title')
    // add elements to DOM
    container.appendChild(inputTitleLabel)
    container.appendChild(inputTitle)
}

async function createSelectElement(container) {
    // Create select element
    let selectElement = document.createElement('select')
    selectElement.name = 'categories'
    selectElement.id = 'categories'
    selectElement.classList.add('input')
    let selectLabel = document.createElement('label')
    selectLabel.setAttribute('for', 'categories')
    selectLabel.id = 'select-category'
    selectLabel.textContent = 'Catégorie'
    let defaultOption = document.createElement('option')
    defaultOption.value = ''
    selectElement.appendChild(defaultOption)
    container.appendChild(selectLabel)
    container.appendChild(selectElement)
    const categoriesId = await getCategoriesId()
    // console.log(categoriesId)
    for (const element of categoriesId) {
        let option = document.createElement('option')
        option.value = element.name
        option.textContent = element.name
        option.id = element.id
        selectElement.appendChild(option)
    }
}

function createErrorParagraph(container, id) {
    let errorParagraph = document.createElement('div')
    errorParagraph.id = 'error' + id
    errorParagraph.setAttribute('aria-hidden', 'true')
    container.appendChild(errorParagraph)
}

let form
function createFormAddWord() {
    // remove last button and create new submit button
    document.querySelector('.add-photo-btn').remove()
    let newSubmitButton = document.createElement('div')
    newSubmitButton.id = 'newSubmitButton'
    newSubmitButton.innerText = 'Valider'
    newSubmitButton.classList.add('add-photo-btn') // check here
    newSubmitButton.style.textAlign = 'center'
    document.querySelector('.close-modale-container').appendChild(newSubmitButton)
    // Craete form element
    form = document.createElement('form')
    form.classList.add('formAddWork')
    let inputFileContainer = document.createElement('div')
    inputFileContainer.classList.add('inputContainer')
    // Create para to display accepted files
    let acceptedText = document.createElement('p')
    acceptedText.classList.add('acceptedText')
    acceptedText.textContent = 'jpg, png : 4mo max'
    // Create img to display default icon
    let backgroundImg = document.createElement('img')
    backgroundImg.src = '../FrontEnd/assets/icons/bcc-img-form.png'
    inputFileContainer.appendChild(backgroundImg)
    // Create input type file
    createInputFile(inputFileContainer)
    inputFileContainer.appendChild(acceptedText)

    // form.classList.add('formAddWork')
    form.appendChild(inputFileContainer)
    // Create input type text
    createInputText(form)
    // Create input type select
    createSelectElement(form)
    // Insert boxes to display errors
    createErrorParagraph(form, 'File')
    createErrorParagraph(form, 'Title')
    createErrorParagraph(form, 'Category')

    editionGalleryContent.appendChild(form)
    validateInputForm(form)
       
}

/**
 * Validate form inputs
 */

/**
 * For sending errors in form on submit
 * @param {string} message 
 * @param {number} id 
 */
function sendErrorMessage(message, id) {
    let errorsForm = document.getElementById('error'+id)
    errorsForm.textContent = message

}

/**
 * Check if input type file exists and display error message
 * @param {object} inputFile
 * @returns {boolean}
 */
function validateInputFile(inputFile) {
    if (inputFile.value !== '') {
        document.getElementById('errorFile').style.display = 'none'

        return true
    } else {
        sendErrorMessage('Chargez une image', 'File')
    }
}

/**
 * Create a preview for loaded image
 * @param {object} inputFile 
 */
function updatePreviewImg(inputFile) {
        document.getElementById('errorFile').style.display = 'none'
        let imgPreview = document.createElement('img')
        imgPreview.style.maxHeight = '169px'
        imgPreview.src = URL.createObjectURL(inputFile.files[0])
        imgPreview.alt = inputFile.files[0].name
        document.querySelector('.inputContainer').innerHTML =""
        document.querySelector('.inputContainer').appendChild(imgPreview)
        formToSend.append('imageUrl', imgPreview.src)

}

/**
 * Check if input type text exists and display error message
 * @param {string} inputTitleValue 
 * @returns {boolean}
 */
function validateInputTitle(inputTitleValue) {
    // inputTitleValue === '' ? sendErrorMessage('Renseignez un titre', 'Title') : document.getElementById('errorTitle').style.display = 'none'
    if (inputTitleValue !== '') {
        formToSend.append('title', inputTitleValue)
        document.getElementById('errorTitle').style.display = 'none'
        return true
    } else if (inputTitleValue === '') {
        sendErrorMessage('Renseignez un titre', 'Title')
    }
}

/**
 * Check if input type select exists and display error message
 * @param {string} inputCategoryValue 
 * @returns {boolean}
 */
function validateInputCategory(inputCategoryValue, inputCategoryId) {
    // inputCategoryValue === '' ? sendErrorMessage('Renseignez une catégorie', 'Category') : document.getElementById('errorCategory').style.display = 'none'
    console.log(inputCategoryValue, inputCategoryId)
    if (inputCategoryValue !== '') {
        formToSend.append('categoryId', 1)
        document.getElementById('errorCategory').style.display = 'none'
        return true
    } else {
        sendErrorMessage('Renseignez une catégorie', 'Category')
    }
}

form = document.getElementById('formAddWork')

let formToSend = new FormData()

async function postWork(formToSend) {
    // fetch
    const token = window.sessionStorage.getItem('token')
    let datas
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formToSend,
            headers: { 
                'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`,
                    },
        })
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


/**
 * For validate all entries in form submitted
 * @param {object} form 
 */
async function validateInputForm(form) {
    let currentId = await getDatas()

    let inputFile = document.getElementById('file')
    let inputTitle = document.getElementById('title')
    let inputCategory = document.getElementById('categories')
    // Listener to display preview image on change
    inputFile.addEventListener('change', () => {
        console.log('change')
        updatePreviewImg(inputFile)
    })
    // Listener to submit form
    document.getElementById('newSubmitButton').addEventListener('click', (event) => {
        event.preventDefault()
        validateInputFile(inputFile)
        validateInputTitle(inputTitle.value)
        validateInputCategory(inputCategory.value, inputCategory.id)
        if (validateInputFile(inputFile) && validateInputTitle(inputTitle.value) && validateInputCategory(inputCategory.value)) {
            // Here code fetch post !!
            // let idToInsert = currentId.length + 1
            // formToSend.append('id', idToInsert)
            // formToSend.append('userId', 0)
            // console.log(idToInsert)
            // console.log(formToSend.get('title'))
            // console.log('ok for sending form')
            // console.log(formToSend.get('id'))
            console.log(formToSend.get('title'))
            console.log(formToSend.get('imageUrl'))
            console.log(formToSend.get('categoryId'))
            // console.log(formToSend.get('userId'))
            postWork(formToSend)
        
        }
        })

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
    

    // element.setAttribute('form', 'formAddWork')
    // element.disabled = true
}

function resetAddWorkBtnBehavior(element) {
    element.textContent = "Ajouter une photo"
    element.classList.remove('disabled')
    element.disabled = false
}

let modaleTitle
function addWork() {
    let addWorkBtn = document.querySelector('.add-photo-btn')
    // addWorkBtn.setAttribute('type', 'submit')
    addWorkBtn.addEventListener('click', (behaviorBtn) => {
        editionGalleryContent.innerHTML = ""
        editionGalleryContent.classList.remove('gallery-modale')
        createReturnButton(closeModaleBtns)
        closeModaleBtns.classList.add('spaceBetween')
        createFormAddWord()
        modaleTitle = document.querySelector('.modale-title')
        modaleTitle.innerText = "Ajout photo"
        setAddWorkBtnBehavior(addWorkBtn)
        // validateInputForm()
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
