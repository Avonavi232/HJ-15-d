'use strict';

class Modal{
    constructor(modal){
        this.modal = modal;
    }
    open(){
        this.modal.style.display = 'block';
    }
    close(){
        this.modal.style.display = 'none';
    }
    init(){
        this.modal.querySelector('.js-modal-close').addEventListener('click', e => {
           this.close();
        });
    }
}

const modal = new Modal(document.querySelector('.js-modal'));
modal.init();

for (const thumbnail of document.querySelectorAll('.card-thumbnail')){
    thumbnail.addEventListener('click', () => {
        modal.open();
    });
}