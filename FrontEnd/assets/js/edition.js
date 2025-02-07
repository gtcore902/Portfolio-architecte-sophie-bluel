import { getDatas } from "./main.js";
import displayMainGalleryHome from "./main.js";

/**
 * Create edition bar
 */
function createEditionBar() {
    let editionModeBar = document.createElement("div");
    let mainHeader = document.querySelector(".main-header")
    mainHeader.style.marginTop = "109px"
    editionModeBar.classList.add("editionMode-bar")
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
    let loginHref = document.querySelector(".login-href")
    loginHref.textContent = "logout"
    loginHref.href = ""
    loginHref.addEventListener("click", () => {
        logout()
    })
}

/**
 * Logout function
 */
function logout() {
    window.sessionStorage.removeItem("token")
}

/**
 * Set mode edition on index.html
 */
function editionModeButton() {
    // Display none filters buttons
    let elementContainer = document.querySelector(".filters")
    elementContainer.style.display = "none"
    // Create new element to trigger
    let titleProjects = document.querySelector(".title-projects")
    titleProjects.style.marginBottom = "51px"
    let spanModifier = document.createElement("a")
    spanModifier.classList.add("link-modifier")
    spanModifier.innerHTML = `
       <i class="fa-regular fa-pen-to-square"></i>
        <span class="span-edition">Modifier</span>
        `
    titleProjects.appendChild(spanModifier)
}

// Set modale system
let modaleContainer = document.querySelector(".modale-container")
let modaleContent = document.querySelector(".modale-content")
let closeModaleBtns = document.querySelector(".close-modale-btn")
let editionGalleryContent = document.querySelector(".gallery-modale")


/**
 * open modale on click and display gallery on modale
 */
async function openModal() {
    const datas = await getDatas()
    let editionSpan = document.querySelector(".link-modifier")
    editionGalleryContent.innerHTML = ""
    editionSpan.addEventListener("click", () => {
        modaleContainer.style.display = "flex"
        editionGalleryContent.innerHTML = ""
        // code gallery content
        displayGalleryEdition(datas)
    })
    modaleContent.addEventListener("click", (event) => {
        event.stopPropagation()
    })
}
/**
 * Reset gallery modal content and display none and reinit
 */
function resetModale() {
    resetAddWorkBtnBehavior(document.querySelector(".add-photo-btn"))
    modaleContainer.style.display = "none"
    editionGalleryContent.innerHTML = ""
    editionGalleryContent.classList.add("gallery-modale")
    closeModaleBtns.classList.remove("spaceBetween")
    if (document.getElementById("return-btn") !== null) {
        document.getElementById("return-btn").remove()
    } 
    modaleContainer.setAttribute("aria-hidden", "true")
}

/**
 * Listeners for reset modale
 */
function closeModale() {
    resetAddWorkBtnBehavior(document.querySelector(".add-photo-btn"))
    closeModaleBtns.classList.remove("spaceBetween")
    modaleContainer.addEventListener("click", () => resetModale())
    let closeModaleBtn = document.querySelector(".closeModal")
    closeModaleBtn.addEventListener("click", () => resetModale())
    if (document.getElementById("return-btn") !== null) {
        document.getElementById("return-btn").remove()
    } 
}

/**
 * function gallery content
 * @param {object} datas 
 */
async function displayGalleryEdition(datas) {
    document.querySelector(".gallery-modale").innerHTML = ""
    datas = await getDatas()
    for (let i = 0; i < datas.length; i++) {
        let contentImg = document.createElement("div")
        contentImg.classList.add("element-container")
        let imgTag = document.createElement("img")
        let deleteBtn = document.createElement("div")
        deleteBtn.classList.add("delete-btn")
        deleteBtn.id = datas[i].id
        deleteBtn.innerHTML = `<i id=${datas[i].id} class="fa-solid fa-trash-can fa-xs"></i>`
        imgTag.src = datas[i].imageUrl
        imgTag.classList.add("edition-gallery-img")
        contentImg.appendChild(imgTag)
        contentImg.appendChild(deleteBtn)
        editionGalleryContent.appendChild(contentImg)
        deleteBtn.addEventListener("click", (event) => {
            // Get id of the element that was clicked
            let workId
            event.target.id === "" ? workId = event.target.parentNode.id : null
            event.target.id !== "" ? workId = event.target.id : null
            deleteWork(workId) 
                    .then(workId = "")
        })
    }
    addWork()
    modaleContainer.setAttribute("aria-hidden", "false")
}

/**
 * Function to delete element
 * @param {number} workId 
 */
async function deleteWork(workId) {
    const token = window.sessionStorage.getItem("token")
    let datas
    // fetch
    try {
        const response = fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
        }).then((data) => console.log(data))
            .then(datas = await getDatas())
                // .then(console.log(datas))
                        .then(await displayGalleryEdition(datas))
                            .then(await displayMainGalleryHome(datas))
        if (response.status === 404) {
            throw new Error("401, Unauthorized")
        }
        if (response.status === 500) {
            throw new Error("500, Internal servor error")
        }
            
    } catch (error) {
        console.log("Error: ", error)
    }
}


// // Function to add works
/**
 * Fetch function to get categories from API
 * @returns {Promise<{id: number, name: string}[]>} ids and names of categories
 */
export async function getCategoriesId() {
    const response = await fetch("http://localhost:5678/api/categories")
    // Handle error
    try {
        if (response.status === 500) {
            throw new Error("500, Internal servor error")
        }
        let categoriesId = await response.json()
        return categoriesId
    } catch (error) {
        console.error(error)
    }
}

/**
 * Create input file to add file
 * @param {object} container 
 */
function createInputFile(container) {
    // Create input type file
    let inputFile = document.createElement("input")
    inputFile.type = "file"
    inputFile.id = "file"
    inputFile.classList.add("to-hide")
    inputFile.setAttribute("name", "image")
    inputFile.setAttribute("accept", ".jpg, .png")
    inputFile.style.opacity = 0 
    // Create label for file
    let inputFileLabel = document.createElement("label")
    inputFileLabel.classList.add("input-file")
    inputFileLabel.classList.add("to-hide")
    inputFileLabel.textContent = "+ Ajouter photo"
    inputFileLabel.setAttribute("for", "file")
    // add elements to DOM
    container.appendChild(inputFileLabel)
    container.appendChild(inputFile)
}

/**
 * Create input text to add title
 * @param {object} container 
 */
function createInputText(container) {
    // Create input type text
    let inputTitle = document.createElement("input")
    inputTitle.type = "text"
    inputTitle.classList.add("input")
    inputTitle.name = "title"
    inputTitle.id = "title"
    // Create label for input text
    let inputTitleLabel = document.createElement("label")
    inputTitleLabel.textContent = "Titre"
    inputTitleLabel.setAttribute("for", "title")
    // add elements to DOM
    container.appendChild(inputTitleLabel)
    container.appendChild(inputTitle)
}

/**
 * Create select input to add category
 * @param {object} container 
 */
async function createSelectElement(container) {
    // Create & insert select element
    let selectElement = document.createElement("select")
    selectElement.name = "category"
    selectElement.id = "categories"
    selectElement.classList.add("input")
    // Create & insert label element
    let selectLabel = document.createElement("label")
    selectLabel.setAttribute("for", "categories")
    selectLabel.id = "select-category"
    selectLabel.textContent = "Catégorie"
    // Create & insert option element
    let defaultOption = document.createElement("option")
    defaultOption.value = ""
    selectElement.appendChild(defaultOption)
    container.appendChild(selectLabel)
    container.appendChild(selectElement)
    const categoriesId = await getCategoriesId()
    for (const element of categoriesId) {
        let option = document.createElement("option")
        option.value = element.id
        option.textContent = element.name
        selectElement.appendChild(option)
    }
}

/**
 * 
 * @param {object} container 
 * @param {number} id 
 */
function createErrorParagraph(container, id) {
    let errorParagraph = document.createElement("div")
    errorParagraph.id = "error" + id
    errorParagraph.setAttribute("aria-hidden", "true")
    container.appendChild(errorParagraph)
}


/**
 * Create new submit button
 */
function createSubmitButton() {
    let newSubmitButton = document.createElement("button")
    newSubmitButton.id = "newSubmitButton"
    newSubmitButton.setAttribute("form", "formAddWork")
    newSubmitButton.setAttribute("type", "submit")
    newSubmitButton.innerText = "Valider"
    newSubmitButton.classList.add("add-photo-btn")
    newSubmitButton.classList.add("disabled")
    newSubmitButton.style.textAlign = "center"
    document.querySelector(".close-modale-container").appendChild(newSubmitButton)
}
/**
 * Create form element and insert inputs
 */
let form
function createFormAddWork() {
    // Remove last button and create new submit button
    document.querySelector(".add-photo-btn").remove()
    // Insert new submit button
    createSubmitButton()
    // Craete form element
    form = document.createElement("form")
    form.id = "formAddWork"
    form.setAttribute("action", "")
    form.setAttribute("method", "post")
    form.classList.add("formAddWork")
    let inputFileContainer = document.createElement("div")
    inputFileContainer.classList.add("inputContainer")
    // Create paragraph to display accepted files
    let acceptedText = document.createElement("p")
    acceptedText.classList.add("acceptedText")
    acceptedText.classList.add("to-hide")
    acceptedText.textContent = "jpg, png : 4mo max"
    // Create img to display default icon
    let backgroundImg = document.createElement("img")
    backgroundImg.classList.add("to-hide")
    backgroundImg.src = "../FrontEnd/assets/icons/bcc-img-form.png"
    inputFileContainer.appendChild(backgroundImg)
    // Create input type file
    createInputFile(inputFileContainer)
    inputFileContainer.appendChild(acceptedText)

    form.appendChild(inputFileContainer)
    // Create input type text
    createInputText(form)
    // Create input type select
    createSelectElement(form)
    // Insert boxes to display errors
    createErrorParagraph(form, "File")
    createErrorParagraph(form, "Title")
    createErrorParagraph(form, "Category")
    // Add to DOM
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
    let errorsForm = document.getElementById("error"+id)
    errorsForm.textContent = message
}

/**
 * Create element to display confirmation message
 * @param {object} container 
 */
function createSendingValidationMessage(container) {
    let formConfirmationMessage = document.createElement("p")
    formConfirmationMessage.id = "checked-form"
    container.appendChild(formConfirmationMessage)
    formConfirmationMessage.textContent = "Votre travail a bien été ajouté"
  }

/**
 * Create function to delete confirmation message after timeout
 */
function deleteValidationMessage() {
    let formConfirmationMessage = document.getElementById("checked-form")
    if (formConfirmationMessage !== null) {
        formConfirmationMessage.remove()
    }
}

/**
 * Check if input type file exists and display error message
 * @param {object} inputFile
 * @returns {boolean}
 */
function validateInputFile(inputFile) {
    if (inputFile.value !== "") {
        document.getElementById("errorFile").style.display = "none"
        return true
    } else {
        document.getElementById("errorFile").style.display = "block"
        sendErrorMessage("Chargez une image", "File")
    }
}

/**
 * Add class to hide element to display preview image
 * @param {object} elements 
 */
function hideElements(elements, imgPreview) {
    for (const element of elements) {
        element.classList.toggle("not-visible")
    }
    imgPreview.remove()
}

/**
 * Create a preview for loaded image
 * @param {object} inputFile 
 */
function updatePreviewImg(inputFile) {
    document.getElementById("errorFile").style.display = "none"
    let elementToHide = document.querySelectorAll(".to-hide")
    let imgPreview = document.createElement("img")
    imgPreview.style.position = "absolute"
    imgPreview.style.maxHeight = "169px"
    imgPreview.src = URL.createObjectURL(inputFile.files[0])
    imgPreview.alt = inputFile.files[0].name
    imgPreview.id = "previewedImg"
    hideElements(elementToHide, imgPreview)
    document.querySelector(".inputContainer").appendChild(imgPreview)
}

/**
 * Check if input type text exists and display error message
 * @param {string} inputTitleValue 
 * @returns {boolean}
 */
function validateInputTitle(inputTitleValue) {
    // Check if input title is empty or with only whitespace
    let regexTitle = new RegExp("[a-zA-Z0-9._-]+")
    if (regexTitle.test(inputTitleValue)) {
        document.getElementById("errorTitle").style.display = "none"
        return true
    } else if (!regexTitle.test(inputTitleValue)) {
        document.getElementById("errorTitle").style.display = "block"
        sendErrorMessage("Renseignez un titre", "Title")
    }
}

/**
 * Check if input type select exists and display error message
 * @param {string} inputCategoryValue 
 * @returns {boolean}
 */
function validateInputCategory(inputCategoryValue) {
    if (inputCategoryValue !== "") {
        document.getElementById("errorCategory").style.display = "none"
        return true
    } else {
        document.getElementById("errorCategory").style.display = "block"
        sendErrorMessage("Renseignez une catégorie", "Category")
    }
}

form = document.getElementById("formAddWork")

/**
 * 
 * @param {object} formData 
 */
async function postWork(formData) {
    // fetch
    const token = window.sessionStorage.getItem("token")
    let datas
    try {
        const response = fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { 
                Authorization: `Bearer ${token}`,
                    },
            body: formData
        
        }).then(datas = await getDatas())
            .then(response => console.log(response))
                .then(displayMainGalleryHome(datas))
                    .then(hideElements(document.querySelectorAll(".to-hide"), document.getElementById("previewedImg")))
                        // .then(document.getElementById("previewedImg").style.display = "none")
                            .then(createSendingValidationMessage(form))
                                .then(setTimeout(deleteValidationMessage, 5000))
                                    .then(form.reset())

        if (response.status === 400) {
            throw new Error("400, Bad Request")
        }
        if (response.status === 404) {
            throw new Error("401, Unauthorized")
        }
        if (response.status === 500) {
            throw new Error("500, Internal server error")
        }
            
    } catch (error) {
        console.log("Error: ", error)
    }
}

/**
 * For validate all entries in form submitted
 * @param {object} form 
 */
async function validateInputForm(form) {
    let inputFile = document.getElementById("file")
    let inputTitle = document.getElementById("title")
    let inputCategory = document.getElementById("categories")
    let inputsArray = [inputFile, inputTitle, inputCategory]
    // Listener to display preview image on change
    inputFile.addEventListener("change", () => {
        updatePreviewImg(inputFile)
    })
    // Set class for submit button on change
    inputsArray.map((element) => element.addEventListener("change", () => {
        document.querySelector(".add-photo-btn").classList.remove("disabled")
    }))
    // Listener to submit form
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        const formData = new FormData(form)
        // const data = Object.fromEntries(formData)
        // Check input file
        validateInputFile(inputFile)
        // Check input title
        validateInputTitle(inputTitle.value)
        // Check input category
        validateInputCategory(inputCategory.value)
        // If all inputs = OK
        if (validateInputFile(inputFile) && validateInputTitle(inputTitle.value) && validateInputCategory(inputCategory.value)) {
            postWork(formData)
        }
    })
}

let returnBtn
/**
 * Create return button on modale
 * @param {object} container 
 */
async function createReturnButton(container) {
    returnBtn = document.createElement("div")
    returnBtn.id = "return-btn"
    returnBtn.classList.add("return-btn")
    returnBtn.innerHTML = "<i class=\"fa-solid fa-arrow-left\"></i>"
    container.prepend(returnBtn)
    returnBtn.addEventListener("click", () => {
        editionGalleryContent.innerHTML = ""
        editionGalleryContent.classList.add("gallery-modale")
        closeModaleBtns.classList.remove("spaceBetween")
        container.removeChild(container.firstElementChild)
        displayGalleryEdition(datas)
        document.querySelector(".modale-title").textContent = "Galerie photo"
        resetAddWorkBtnBehavior(document.querySelector(".add-photo-btn"))

    })
    const datas = await getDatas() 
}

/**
 * 
 * @param {object} element 
 */
function setAddWorkBtnBehavior(element) {
    element.textContent = "Valider"
    element.classList.add("disabled")
}

/**
 * 
 * @param {object} element 
 */
function resetAddWorkBtnBehavior(element) {
    element.textContent = "Ajouter une photo"
    element.classList.remove("disabled")
    element.disabled = false
}

let modaleTitle
/**
 * Display form modale system
 */
function addWork() {
    let addWorkBtn = document.querySelector(".add-photo-btn")
    addWorkBtn.addEventListener("click", () => {
        editionGalleryContent.innerHTML = ""
        editionGalleryContent.classList.remove("gallery-modale")
        if (!document.getElementById("return-btn")) {
            createReturnButton(closeModaleBtns)
        }
        closeModaleBtns.classList.add("spaceBetween")
        createFormAddWork()
        modaleTitle = document.querySelector(".modale-title")
        modaleTitle.innerText = "Ajout photo"
        setAddWorkBtnBehavior(addWorkBtn)
    })
}

/**
 * Check if token exists in local storage and launch admin functions
 */
if (window.sessionStorage.getItem("token")) {
    createEditionBar()
    setHrefButton()
    editionModeButton()
    openModal()
    closeModale()
}
