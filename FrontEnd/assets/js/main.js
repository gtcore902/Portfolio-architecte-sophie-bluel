// Variables
export let gallery = document.querySelector('.gallery')
let objectFilterBtn = document.querySelectorAll('.filter-btn')

// Fetch datas from swagger API or sessionStorage
let datas
let sessionStorage = window.sessionStorage.getItem('datas')

/**
 * Create figure element
 * @param {*} src 
 * @param {*} title 
 */
async function createFigureElement(src, title) {
    const figureElement = document.createElement('figure')
    const imgElement = document.createElement('img')
    imgElement.src = src
    const figcaptionElement = document.createElement('figcaption')
    figcaptionElement.innerText = title
    figureElement.appendChild(imgElement)
    figureElement.appendChild(figcaptionElement)
    gallery.appendChild(figureElement)
}

/**
 * Display gallery
 * @param {object} datas 
 */
export default async function displayGallery(datas) {
    // console.log(datas)
    for (let i = 0; i < datas.length; i++) {
        createFigureElement(datas[i].imageUrl, datas[i].title)
    }
}

/**
 * Main function to get datas from API or sessionStorage
 * @returns {object}
 */
export async function getDatas() {
        const response = await fetch('http://localhost:5678/api/works')
        // Handle error
        try {
            if (response.status === 404) {
                throw new Error('404, Page not found')
            }
            if (response.status === 500) {
                throw new Error('500, Internal servor error')
            }
            datas = await response.json()
        } catch (error) {
            console.error(error)
        }
    return datas
}

// Load and display data
async function launchSystem() {
    await getDatas()
    await displayGallery(datas)
}

launchSystem()

/**
 * Set filter system display & behavior on clicks
 */
for (const element of objectFilterBtn) {
    element.addEventListener('click', function(event) {
        // Get the parent node
        let elementContainer = document.querySelector('.filters')
        // Change style of children
        for (let i = 0; i < elementContainer.children.length; i++) {
            elementContainer.children[i].style.backgroundColor = 'transparent'
            elementContainer.children[i].style.color = '#1D6154'
       }
       // Change style of current element selected
        event.target.style.backgroundColor = '#1D6154'
        event.target.style.color = 'white'
       // Filter system
       // Set behavior of the first element
        if (event.target.dataset.id == 123) {
            const dataObjects = datas.filter(function(data) {
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

