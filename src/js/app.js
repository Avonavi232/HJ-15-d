'use strict';

function wrt(d) {
    console.log(d);
}

//Функционал модалки
class Modal{
    constructor(modal){
        this.modal = modal;
        this.docBody = document.querySelector('body');
    }
    closeAnimEnd(){
        if (this.modal.classList.contains('fadeIn')){
            this.modal.classList.remove('fadeIn');
            this.docBody.classList.add('modal-opened');
        } else if (this.modal.classList.contains('fadeOut')){
            this.modal.style.display = 'none';
            this.modal.classList.remove('fadeOut');
            this.docBody.classList.remove('modal-opened');
        }
    }
    open(){
        this.modal.style.display = 'flex';
        this.modal.classList.remove('fadeOut');
        this.modal.classList.add('fadeIn');
    }
    close(){
        this.modal.classList.remove('fadeIn');
        this.modal.classList.add('fadeOut');
    }
    init(){
        this.modal.querySelector('.js-modal-close').addEventListener('click', () => {this.close();});
        this.modal.addEventListener("webkitAnimationEnd", () => {this.closeAnimEnd();});
        this.modal.addEventListener("animationend", () => {this.closeAnimEnd();});
        window.addEventListener('click', e => {
            if (e.target === this.modal) {
                this.close();
            }
        })
    }
}

//Управляет переключением сайдбара при просмотре иконки
class ImageSidebar{
    constructor(classes){
        this.sidebar = document.querySelector('.' + classes.sidebar);
        this.art = document.querySelector('.' + classes.art);
        this.descr = document.querySelector('.' + classes.descr);
        this.state = true;
    }

    toggle(){
        if (this.state){
            this.descr.style.transform = 'translateX(600px)';
            this.art.style.transform = 'translateX(0px)';
            this.state = false;
        } else {
            this.descr.style.transform = 'translateX(0px)';
            this.art.style.transform = 'translateX(-600px)';
            this.state = true;
        }
    }
}


//Инициализация модальных окон
const showPicModal = new Modal(document.querySelector('.js-show-pic-modal'));
const uploadModal = new Modal(document.querySelector('.js-upload-modal'));
showPicModal.init();
uploadModal.init();


//Ловим клик по миниатюре, используя делегирование событий
document.querySelector('.js-cards-container').addEventListener('click', (e) => {
    for (const curr of e.path){
        if(curr.classList.contains('card-thumbnail')){
            showPicModal.open();
            break;
        } else if(curr.tagName === 'BODY'){
            break; //не поймали, выходим из цикла
        }
    }
});


//Открываем модалку-загрузчик по клику на соотв.кнопке
document.querySelector('.js-upload-pic').addEventListener('click', (e) => {
    uploadModal.open();
});


//Инициализируем поведение сайдбара при просмотре картинки
const imageSidebar = new ImageSidebar({
    sidebar: 'image-sidebar',
    art: 'image-art',
    descr: 'image-infoblock'
});

for (const btn of document.querySelectorAll('.js-image-sidebar-toggle')){
    btn.addEventListener('click', ()=>{
        imageSidebar.toggle();
    })
}



