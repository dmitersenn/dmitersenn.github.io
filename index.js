const mobileMenu = document.querySelector('.mobile-menu')

const buttons = document.querySelectorAll('.request-button')
const telInput = document.querySelector('.tel-input')

const requestForm = document.querySelector('.request-form')
const requestFormContent = document.querySelector('.request-form >.popup-content')
const navbarButton = document.querySelector('.navbar-button')

const upButton = document.querySelector('.button-up')

const galleryContainer = document.querySelector('.gallery')
const galleryContent = document.querySelector('.gallery > .popup-content')
const galleryContentPrev = document.querySelector('.gallery > .popup-content > .prev-element')
const galleryContentNext = document.querySelector('.gallery > .popup-content > .next-element')
const flowersImages = document.querySelectorAll('.flowers-image')
const balloonsImages = document.querySelectorAll('.balloons-image')

const sendForm = document.querySelector('.send-form')
const sendButton = document.querySelector('.send-button')
const sendError = document.querySelector('.send-form > .error')
new IMask(telInput, {
    mask: '+7(000)000-00-00',
})

const toggle = (popupName, popup, openButton, CloseButton) => {

    let isOpen = false
    let open = openButton
    let close = CloseButton
    let name = popupName

    return (state) => {
        switch (name) {
            case 'navbar': {
                isOpen = !isOpen
                open.style.display = isOpen ? 'none' : 'block'
                close.style.display = isOpen ? 'block' : 'none'
            } break
            default: {
                if (window.innerWidth < 800) navbarButton.style.display = state === 'close' ? 'block' : 'none'
                close.style.display = 'block'
            } break
        }
        if (state) {
            isOpen = state === 'close' ? false : true
        }
        document.body.style.overflowY = isOpen ? 'hidden' : 'auto'
        popup.style.display = !isOpen ? 'none' : 'flex'

        
    }
}

const toggleNavbar = toggle(
    'navbar',
    mobileMenu,
    document.querySelector('.navbar-button > .burger-button--open'),
    document.querySelector('.navbar-button > .burger-button--close')
)

const toggleGallery = toggle(
    'gallery',
    galleryContainer,
    null,
    document.querySelector('.gallery > .burger-button > .burger-button--close')
)

const toggleForm = toggle(
    'form',
    requestForm,
    null,
    document.querySelector('.request-form > .burger-button > .burger-button--close')
)

buttons.forEach(button => {
    button.addEventListener('click', toggleForm)
})

requestForm.addEventListener('click', event => {
    toggleForm('close')

})
requestFormContent.addEventListener('click', event => {
    event.stopPropagation()
})


galleryContainer.addEventListener('click', event => {
    toggleGallery('close')

})
galleryContent.addEventListener('click', event => {
    event.stopPropagation()
})

function Gallery(images, currentImageIndex) {
    this.imagesSrc = []
    images.forEach(element => {
        this.imagesSrc.push(element.src)
    })
    this.currentImageIndex = currentImageIndex
    this.left = []
    this.right = []
    this.currentImage = null

    this.toPrev = () => {
        if (this.currentImageIndex === 0) return
        this.currentImageIndex--
        this.renderImage()
    }

    this.toNext = () => {
        if (this.currentImageIndex === this.imagesSrc.length - 1) return
        this.currentImageIndex++
        this.renderImage()
    }

    this.getSrcImage = () => {
        return this.imagesSrc[this.currentImageIndex]
    }

    this.clearContent = () => {
        while(galleryContent.children.length > 2) {
            galleryContent.removeChild(galleryContent.children[galleryContent.children.length - 1])
        }
    }

    this.renderImage = () => {
        this.clearContent()
        galleryContent.appendChild(this.createImg())
    }

    this.createImg = () => {
        const img = new Image()
        img.src = this.getSrcImage()
        return img
    }

    galleryContentPrev.addEventListener('click', this.toPrev)
    galleryContentNext.addEventListener('click', this.toNext)
}

let gallery

const openGallery = (images, currentImageIndex) => {
    gallery = new Gallery(images, currentImageIndex)
    gallery.renderImage()
    toggleGallery('open')
}

flowersImages.forEach((element, key) => {
    element.addEventListener('click', () => openGallery([...flowersImages], key))
})

balloonsImages.forEach((element, key) => {
    element.addEventListener('click', () => openGallery([...balloonsImages], key))
})


upButton.addEventListener('click', () => {
    scroll(0, 0)
})

window.addEventListener('scroll', event => {
    if (window.scrollY > 1000) upButton.style.right = '35px'
    else upButton.style.right = '-100px'
})

new Splide('.splide').mount()

let map;

function initMap() {
    const pos = { lat: 45.05019749516151, lng: 39.039320128901615 }
    map = new google.maps.Map(document.getElementById("map"), {
        center: pos,
        zoom: 15,
    })

    new google.maps.Marker({
        position: pos,
        map,
    })
}

const validateAndGet = ({ elements }, errorField) => {
    errorField.innerHTML = ''
    console.log(elements)
    const formData = {}
    for(let i = 0; i < elements.length; i++) {
        let item = elements.item(i)
        formData[item.name] = item.value
    }
    delete formData['']
    if (!formData.name.length) { 
        errorField.innerHTML = 'Укажите имя!'
        return
    }
    if (formData.phone.length !== 16) {
        errorField.innerHTML = 'Укажите номер телефона!'
        return
    }
    return formData
}

sendForm.addEventListener('submit', async event => {
    event.preventDefault()
    if (!validateAndGet(
        sendForm,
        sendError
    )) return
    try {
        await fetch('send.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(validateAndGet(sendForm, document.querySelector('.send-form > .error')))
        })
        sendButton.innerHTML = 'Скоро перезвоним!'
        sendButton.style.background = '#8dc477'
    } catch(e) {
        sendError.innerHTML = 'Произошла ошибка. Повторите попытку'
    }
})