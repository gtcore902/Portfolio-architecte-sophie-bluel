// Variables
import { getCategoriesId } from "./edition.js"
let gallery = document.querySelector(".gallery")
let datas

/**
 * Create figure element
 * @param {*} src 
 * @param {*} title 
 */
async function createFigureElement(src, title) {
    const figureElement = document.createElement("figure")
    const imgElement = document.createElement("img")
    imgElement.src = src
    const figcaptionElement = document.createElement("figcaption")
    figcaptionElement.innerText = title
    figureElement.appendChild(imgElement)
    figureElement.appendChild(figcaptionElement)
    if (gallery) {
        gallery.appendChild(figureElement)
    }
}

/**
 * Display gallery
 * @param {object} datas 
 */
export default async function displayMainGalleryHome(datas) {
    // console.log(datas)
    datas = await getDatas()
    if (gallery) {
        gallery.innerHTML = ""  
    }
    // console.log(gallery)
    for (let i = 0; i < datas.length; i++) {
        createFigureElement(datas[i].imageUrl, datas[i].title)
    }
}

/**
 * Main function to get datas from API
 * @returns {object}
 */
export async function getDatas() {
        const response = await fetch("http://localhost:5678/api/works")
        // Handle error
        try {
            if (response.status === 404) {
                throw new Error("404, Page not found")
            }
            if (response.status === 500) {
                throw new Error("500, Internal servor error")
            }
            datas = await response.json()
            // console.log(datas)
        } catch (error) {
            console.error(error)
        }
    return datas
}

// Load and display data
async function launchSystem() {
    await getDatas()
    await displayMainGalleryHome(datas)
}

launchSystem()

/**
 * Set filter system display & behavior on clicks
 */
/**
 * Set behavior on click
 */
function setBehaviorOnClick() {
    let objectFilterBtn = document.querySelectorAll(".filter-btn")
    for (const element of objectFilterBtn) {
        element.addEventListener("click", function(event) {
            // Get the parent node
            let elementContainer = document.querySelector(".filters")
            // Change style of children
            for (let i = 0; i < elementContainer.children.length; i++) {
                elementContainer.children[i].style.backgroundColor = "transparent"
                elementContainer.children[i].style.color = "#1D6154"
           }
           // Change style of current element selected
            event.target.style.backgroundColor = "#1D6154"
            event.target.style.color = "white"
           // Filter system
           // Set behavior of the first element
            if (event.target.dataset.id === "0") {
                const dataObjects = datas.filter(function() {
                    gallery.innerHTML = ""
                    return datas
                 })
                for (let i = 0; i < dataObjects.length; i++) {
                    createFigureElement(dataObjects[i].imageUrl, dataObjects[i].title)
                }
            } else {
                // Set behavior of others elements
                const dataObjects = datas.filter(function(data) {
                    gallery.innerHTML = ""
                    return data.categoryId === parseInt(event.target.dataset.id)
                    })
                for (let i = 0; i < dataObjects.length; i++) {
                    createFigureElement(dataObjects[i].imageUrl, dataObjects[i].title)
                }
            }
        })
    }
}

/**
 * Get id from API and create buttons for filtering
 */
async function getId() {
    const categoriesId = await getCategoriesId()
    let btnAllCategories = document.createElement("button")
    btnAllCategories.textContent = "Tous"
    btnAllCategories.classList.add("filter-btn")
    btnAllCategories.setAttribute("data-id", "0")
    let filtersContainer = document.querySelector(".filters")
    filtersContainer.appendChild(btnAllCategories)
    categoriesId.map((element) => {
        let btnCategory = document.createElement("button")
        btnCategory.setAttribute("data-id", element.id)
        btnCategory.classList.add("filter-btn")
        btnCategory.textContent = element.name
        filtersContainer.appendChild(btnCategory)
    })
    setBehaviorOnClick()
}
getId()
