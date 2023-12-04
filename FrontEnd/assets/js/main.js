// Variables
let gallery = document.querySelector('.gallery')
let objectFilterBtn = document.getElementById('objects')

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

// Fetch datas from swagger API
async function getDatas() {
    const response = await fetch('http://localhost:5678/api/works')
    const datas = await response.json()
    for (let i = 0; i < datas.length; i++) {
        createFigureElement(datas[i].imageUrl, datas[i].title)
    }
    objectFilterBtn.addEventListener('click', function(event) {
        // console.log(event.target)
        const dataObjects = datas.filter(function(data) {
            gallery.innerHTML = ""
            return data.categoryId === 2
    })
    for (let i = 0; i < dataObjects.length; i++) {
        createFigureElement(dataObjects[i].imageUrl, dataObjects[i].title)
    }
})}

try {
    getDatas()
} catch (error) {
    console.error(error)
}


