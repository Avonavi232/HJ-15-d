'use strict';

function wrt(d) {
    console.log(d);
}

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
            if (e.target == this.modal) {
                this.close();
            }
        })
    }
}

const showPicModal = new Modal(document.querySelector('.js-show-pic-modal'));
const uploadModal = new Modal(document.querySelector('.js-upload-modal'));
showPicModal.init();
uploadModal.init();


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
document.querySelector('.js-upload-pic').addEventListener('click', (e) => {
    uploadModal.open();
});

