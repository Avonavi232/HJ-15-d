'use strict';

function wrt(d) {
    console.log(d);
}


/****************************************/
/*************Функционал модалки*********/
/****************************************/
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
/****************************************/


/****************************************/
/*******имитация ответов сервера*********/
/****************************************/
class Server{
    //Метод отдает всю ленту (массив объектов)
    static getFeed(){
        return fetch('./src/js/feed.json', {
            method: 'GET'
        });
    }


    //Метод отдает одну карточку по id (объект)
    static getCard(id){
        return fetch('./src/js/feed.json', {
            method: 'GET'
        })
            .then( res => res.json() )
            .then( data => {
                return data.find((el, i) => {
                    if (el.id === Number(id)){
                        return el;
                    }
                });
            } );
    }
}
/****************************************/


/****************************************/
/******Поведение сайдбара модалки********/
/****************************************/
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
/****************************************/


/****************************************/
/*************ImageLoader****************/
/****************************************/
class ImageLoader{
    constructor(dropArea){
        this.dropArea = dropArea;
        this.dropAreaInner = this.dropArea.firstElementChild;
        this.inputReplacer = document.querySelector('.js-upload-input-replacer');
        this.input = document.querySelector('.js-upload-input');
        this.preview = document.querySelector('.js-upload-image-preview');

        this.modalOpenBtn = document.querySelector('.js-upload-pic-btn');
        this.modalUploadCancelBtn = document.querySelector('.js-upload-cancel');
        this.modalUploadAcceptBtn = document.querySelector('.js-upload-accept');
        this.modal = new Modal(document.querySelector('.js-upload-modal'));
        this.modal.init();
    }

    //методы управления превьюшкой
    getPreviewImg(files) {
        if (!files.length) return; //если массив пустой - выходим
        if (files[0].type.indexOf('image') === -1) return; //если не картинка - выходим
        return URL.createObjectURL(files[0]);
    }
    showPreviewImg(src){
        const img = document.createElement('img');
        img.src = src;
        img.addEventListener('load', event => {
            URL.revokeObjectURL(event.target.src);
        });
        this.removePreviewImg();
        this.preview.appendChild(img);
    }
    removePreviewImg(){
        this.preview.textContent = '';
    }

    //При отмене загрузик подчищаем превью и закрываем модалку
    uploadCancel(){
        this.modal.close();
        this.removePreviewImg();
    }


    init(){
        //Обработка загрузки картинки через инпут
        this.input.addEventListener('change', e => {
            e.preventDefault();

            const src = this.getPreviewImg(e.currentTarget.files);
            this.showPreviewImg(src);

        });


        //Обработка дропа картинки
        this.dropArea.addEventListener('drop', e => {
            e.preventDefault();

            const src = this.getPreviewImg(e.dataTransfer.files);
            this.showPreviewImg(src);

            //Уберем стилизующий класс
            this.dropArea.classList.remove('upload-modal__drop-area_dragover');
        });


        //Стилизация области дропа при dragover
        this.dropArea.addEventListener('dragover', e => {
            e.preventDefault();

            if(e.target === this.dropArea || e.target === this.dropAreaInner){
                this.dropArea.classList.add('upload-modal__drop-area_dragover');
            }
        });


        //Делегируем клик по заменителю инпута самому инпуту
        this.inputReplacer.addEventListener('click', ()=>{
           this.input.click();
        });


        //Открываем модалку-загрузчик по клику на соотв.кнопке
        this.modalOpenBtn.addEventListener('click', (e) => {
            this.modal.open();
        });


        //Обработка отмены загрузки
        this.modalUploadCancelBtn.addEventListener('click', (e) => {
            this.uploadCancel();
        });
    }
}

const dropArea = new ImageLoader(document.querySelector('.js-drop-area'));
dropArea.init();
/****************************************/


/****************************************/
/****************FEED********************/
/****************************************/
class Feed{
    static get feed(){
        return document.querySelector('.js-feed');
    }

    //Методы для создания карточки-миниатюры
    static createStat(className, stat) {
        const td = document.createElement('td');

        const p = document.createElement('p');
        p.classList.add('stat', 'js-stat-likes');
        td.appendChild(p);

        const icon = document.createElement('span');
        icon.classList.add(className);
        p.appendChild(icon);

        const title = document.createElement('span');
        title.textContent = stat;
        p.appendChild(title);

        return td;
    }

    static createCard(card){
        const container = document.createElement('div');
        container.classList.add('card-thumbnail');
        container.dataset.id = card.id;

        const overlay = document.createElement('div');
        overlay.classList.add('card-thumbnail__overlay');
        container.appendChild(overlay);

        const stats = document.createElement('div');
        stats.classList.add('card-thumbnail__stats', 'stats');
        container.appendChild(stats);

        const table = document.createElement('table');
        stats.appendChild(table);

        const row = document.createElement('tr');
        row.appendChild(Feed.createStat('icon-heart', card.likes));
        row.appendChild(Feed.createStat('icon-bubble', card.comments));
        table.appendChild(row.cloneNode(true));

        row.textContent = '';
        row.appendChild(Feed.createStat('icon-eye', card.seen));
        row.appendChild(Feed.createStat('icon-pencil', card.art));
        table.appendChild(row);

        const img = document.createElement('img');
        img.src = card.src;
        container.appendChild(img);

        return container;
    }

    static renderFeed(feed){
        let counter = 0;
        const fragment = document.createDocumentFragment();
        for (const card of feed){
            if (counter === 0) {
                const newRow = document.createElement('div');
                newRow.classList.add('row');
                fragment.appendChild(newRow);
            }
            const curr = fragment.lastElementChild;

            const col = document.createElement('div');
            col.classList.add('col-sm-4');
            curr.appendChild(col);
            col.appendChild(Feed.createCard(card));

            ++counter === 3 ? counter = 0 : '';
        }
        Feed.feed.textContent = '';
        Feed.feed.appendChild(fragment);
    }

    static updFeed(){
        Server.getFeed()
            .then( res => res.json() )
            .then( feed => Feed.renderFeed(feed));
    }
}

Feed.updFeed();

/****************************************/


/****************************************/
/***********Модалка просмотрщик**********/
/****************************************/
class ShowPicModal extends Modal{
    constructor(modal){
        super(modal);
        this.pic = modal.querySelector('.js-image-natural');
        this.likes = modal.querySelector('.js-image-like-counter');
        this.comments = modal.querySelector('.js-image-comment-counter');
        this.seen = modal.querySelector('.js-image-seen-counter');
        this.art = modal.querySelector('.js-art-counter');
        this.author = modal.querySelector('.js-image-author');
        this.postDate = modal.querySelector('.js-image-date');
        this.tags = modal.querySelector('.js-image-hashtags');
        this.commentsList = modal.querySelector('.image-comments');
        this.description = modal.querySelector('.js-image-description');

    }

    updateModalData(card){
        return Server.getCard(card.dataset.id)
            .then(cardData => {
                //Картинка
                this.pic.textContent = '';
                const img = document.createElement('img');
                img.src = cardData.src;
                this.pic.appendChild(img);
                return cardData;
            })
            .then( cardData => {
                //Статы
                this.likes.textContent = cardData.likes;
                this.comments.textContent = cardData.comments;
                this.seen.textContent = cardData.seen;
                this.art.textContent = cardData.art;
                return cardData;
            } )
            .then( cardData => {
                //Остальное
                this.author.textContent = cardData.author;
                this.postDate.textContent = cardData.timestamp; //TODO: преобразовать timestamp в время
                this.description.textContent = cardData.description;
            });


    }

    showPic(card){
        this.updateModalData(card)
            .then( ()=>{
                this.open();
            } );
    }
}
const showPicModal = new ShowPicModal(document.querySelector('.js-show-pic-modal'));
showPicModal.init();

//Ловим клик по миниатюре, используя делегирование событий
document.querySelector('.js-feed').addEventListener('click', (e) => {
    for (const curr of e.path){
        if(curr.classList.contains('card-thumbnail')){
            showPicModal.showPic(curr);
            break;
        } else if(curr.tagName === 'BODY'){
            break; //не поймали, выходим из цикла
        }
    }
});

/****************************************/









