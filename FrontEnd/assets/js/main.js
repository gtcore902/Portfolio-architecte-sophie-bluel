// Variables
let gallery = document.querySelector('.gallery')

// Creat figure element
function createFigureElement(src, title) {
    const figureElement = document.createElement('figure')
    const imgElement = document.createElement('img')
    imgElement.src = src
    const figcaptionElement = document.createElement('figcaption')
    figcaptionElement.innerText = title
    figureElement.appendChild(imgElement)
    figureElement.appendChild(figcaptionElement)
    gallery.appendChild(figureElement)
}

// Fetch data from swagger API
async function getDatas() {
    const response = await fetch('http://localhost:5678/api/works')
    const data = await response.json()
    for (let i = 0; i < data.length; i++) {
        createFigureElement(data[i].imageUrl, data[i].title)
    }
}

try {
    getDatas()
} catch (error) {
    console.error(error)
}


