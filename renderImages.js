
let loaded = false
let photosArray = []
let main = document.getElementById('row2')


function renderImage(url, id, alt) {

    //create main container
    let mainContainer = document.createElement('li');
    mainContainer.setAttribute('class', 'flipMainDiv')
    mainContainer.setAttribute('id', id)

    //create inner container for front face and back face elements
    let imgContainer = document.createElement('div');
    imgContainer.setAttribute('class', 'imgContainer')
    let flipContainerReady = mainContainer.appendChild(imgContainer)

    //create image container
    let imgDivFront = document.createElement('div');
    imgDivFront.setAttribute('class', 'flip-box-front')

    let imgDivFrontReady = flipContainerReady.appendChild(imgDivFront)

    //create image and append to image container
    let img = document.createElement('img');
    img.src = url
    img.id = id
    img.alt = alt
    imgDivFrontReady.appendChild(img)

    //create container for back face elements
    let imgDetailBack = document.createElement('div');
    imgDetailBack.setAttribute('class', 'flip-box-back')
    flipContainerReady.appendChild(imgDetailBack)

    //create content to be displayed inside back face div
    let backContent = document.createElement('p');
    backContent.innerText = alt
    backContent.setAttribute('class', 'back-content-detail')

    //added delete icon image
    let deleteIconImg = document.createElement('img');
    deleteIconImg.setAttribute('class', 'delete-icon')
    deleteIconImg.src = './staticData/deleteIcon.svg'
    deleteIconImg.alt = 'deletecon'

    //added on click event on delete icon, to delete image
    deleteIconImg.addEventListener('click', () => deletImage(id))
    imgDetailBack.appendChild(backContent)
    imgDetailBack.appendChild(deleteIconImg)

    //added all elements created to dom in root container
    main.appendChild(mainContainer)

}

//load dummy image placeholder until images fetch and loads
if (!loaded) {
    for (let i = 0; i < 50; i++) {
        let src = './staticData/emptySelection.svg'
        renderImage(src, i, 'defaultIcon')
    }
}

//handler to delete image using image id
const deletImage = (idToBeDelete) => {
    //filter all elements except the id to be delete
    let newArr = photosArray.filter((ele) => {
        return ele.id !== idToBeDelete
    })
    photosArray = newArr

    //clear the dom before rendering new list of images
    main.innerHTML = ""
    //render all images one at atime using renderImage function
    photosArray && photosArray.forEach(({ id, photographer, src: { tiny } }) => {
        renderImage(tiny, id, photographer)
    })
}

//shuffle images on click of shuffle btn
const shuffleImages = () => {
    const ul = document.querySelector('ul')
    for (let i = ul.children.length; i >= 0; i--) {
        ul.appendChild(ul.children[Math.floor(Math.random() * ul.children.length)] || 0)
    }
}
//adding event listner and handle to shuffle element
const shuffleElemet = document.getElementById('shuffling')
shuffleElemet.addEventListener('click', () => shuffleImages())


//axios call to fetch images from an online api
const headers = {
    'Content-Type': 'application/json',
    'Authorization': '563492ad6f9170000100000129aadd74330e4e11949b632953344fc3'
}
let url = 'https://api.pexels.com/v1/curated?per_page=50'

if (!loaded) {
    axios.get(url, {
        headers: headers
    })
        .then((res) => {

            console.log(res)
            const {
                data: {
                    photos
                }
            } = res

            photosArray = photos
            loaded = true
        })
        .catch((err) => {
            console.log(err)
        }).then(() => {
            main.innerHTML = ""
            photosArray && photosArray.forEach(({ id, photographer, src: { tiny } }) => {
                renderImage(tiny, id, photographer)
            })
        })
}