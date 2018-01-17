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
    constructor(){
        this.art = null;
    }
    //Метод отдает всю ленту (массив объектов)
    getFeed(){
        return fetch('./src/js/feed.json', {
            method: 'GET'
        });
    }
    //Метод отдает одну карточку по id (объект)
    getCard(id){
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

    updArtState(state, id){
        if (state === null){
            this.art = null;
        } else {
            this.art = {
                status: true,
                id: id
            }
        }
    }
}
const connection = new Server();
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

    showPreviewInfo(){
        const container = document.createElement('div');
        container.classList.add('upload-infoblock');

        const authorContainer = document.createElement('div');
        authorContainer.classList.add('justified');
        container.appendChild(authorContainer);

        const authorLabel = document.createElement('label');
        authorLabel.setAttribute('for', 'label-upload-author');
        authorLabel.textContent = 'Опубликовать от имени автора:';
        authorContainer.appendChild(authorLabel);

        const authorInput = document.createElement('input');
        authorInput.id = 'label-upload-author';
        authorInput.classList.add('js-upload-author');
        authorContainer.appendChild(authorInput);


        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('justified');
        container.appendChild(descriptionContainer);

        const descriptionLabel = document.createElement('label');
        descriptionLabel.setAttribute('for', 'label-upload-description');
        descriptionLabel.textContent = 'Описание изображения:';
        descriptionContainer.appendChild(descriptionLabel);

        const descriptionInput = document.createElement('textarea');
        descriptionInput.id = 'label-upload-description';
        descriptionInput.classList.add('js-upload-description');
        descriptionContainer.appendChild(descriptionInput);

        this.preview.appendChild(container);
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
            this.showPreviewInfo();
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
        connection.getFeed()
            .then( res => res.json() )
            .then( feed => Feed.renderFeed(feed));
    }
}

Feed.updFeed();

/****************************************/


/****************************************/
/***********Творческий режим*************/
/****************************************/
class Art {
    constructor(imgContainer, controls){
        this.imgContainer = imgContainer;
        this.img = imgContainer.querySelector('img');

        this.canvas = document.createElement('canvas');
        this.canvas.height = this.img.clientHeight;
        this.canvas.width = this.img.clientWidth;
        this.ctx = this.canvas.getContext('2d');

        this.brushColorInput = controls.querySelector('.art-controls-color');
        this.brushWidthInput = controls.querySelector('.art-controls-size');
        this.brushColor = this.brushColorInput.value;
        this.brushWidth = this.brushWidthInput.value;

        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';

        this.shiftPressed = 0; //состояние кнопки Shift (нажато/не нажато)
        this.needsRepaint = false; //требуется ли перерисовка
        this.curves = []; //массив зафиксированных при mousemove кривых
        this.mouseHolded = 0; //состояние левой кн. мыши (нажато/не нажато)
    }

    repaint() {
        //Функция перерисовки всей канвы
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

        for(const curve of this.curves){
            this.circle(curve[0]);
            this.smoothCurve(curve);
        }
    }

    circle(point) {
        //Функция рисует и заливает точку по переданным координатам
        this.ctx.beginPath();
        this.ctx.arc(point[0], point[1], point[3] / 2, 0, 2 * Math.PI);
        this.ctx.save();
        this.ctx.fillStyle = point[2];
        this.ctx.lineWidth = point[3];
        this.ctx.fill();
        this.ctx.restore();
    }

    smoothCurveBetween (p1, p2) {
        //Функция добавляет точку для квадратичной кривой Bezier
        //p1 - end point
        //cp - control point

        const cpx = ( p1[0] + p2[0] ) / 2;
        const cpy = ( p1[1] + p2[1] ) / 2;
        this.ctx.quadraticCurveTo(p1[0], p1[1], cpx, cpy); //почему такая последовательность? в спецификации не такая написана.

    }

    smoothCurve(points) {
        this.ctx.beginPath();

        this.ctx.moveTo(points[0][0], points[0][1]);

        for(let i = 1; i < points.length - 1; i++) {
            this.smoothCurveBetween(points[i], points[i + 1]);
        }

        this.ctx.strokeStyle = points[points.length-1][2];
        this.ctx.lineWidth = points[points.length-1][3];
        this.ctx.stroke();
    }

    tick(){
        this.shiftPressedControl();

        if (this.needsRepaint) {
            this.repaint();
            this.needsRepaint = false;
        }
        window.requestAnimationFrame(()=>{
            this.tick();
        });
    }

    shiftPressedControl(){
        //Следим за нажатием Shift, состояние храним в переменной shiftPressed
        document.addEventListener('keydown', e => {
            e.shiftKey ? this.shiftPressed = 1 : this.shiftPressed = 0;
        });
        document.addEventListener('keyup', e => {
            e.shiftKey ? this.shiftPressed = 1 : this.shiftPressed = 0;
        });
    }

    checkBoundaries(target){
        if (target !== this.canvas)
            return 0;
        return 1;
    }

    init(){
        this.imgContainer.textContent = '';
        this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        this.imgContainer.appendChild(this.canvas);

        this.shiftPressedControl(); //запускаем слежение за shift
        this.tick(); //запускаем тик

        window.addEventListener('resize', () => {
            // this.canvas.height = window.innerHeight;
            // this.canvas.width = window.innerWidth;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });

        this.canvas.addEventListener('mousedown', e => {
            e.preventDefault();
            this.mouseHolded = 1;
            const curve = [];
            curve.push([e.offsetX, e.offsetY, this.brushColor, this.brushWidth]);
            (this.curves).push(curve);
            this.needsRepaint = true;
        });

        document.addEventListener('mouseup', () => {
            this.mouseHolded = 0;
        });

        this.canvas.addEventListener('mousemove', e => {
            e.preventDefault();
            if (!this.mouseHolded) return;
            this.curves[this.curves.length - 1].push([e.offsetX, e.offsetY, this.brushColor, this.brushWidth]);
            this.needsRepaint = true;
        });

        this.canvas.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
            this.curves = [];
        });

        this.brushColorInput.addEventListener('change', e => {
            this.brushColor = e.target.value;
        });
        this.brushWidthInput.addEventListener('change', e => {
            this.brushWidth = e.target.value;
        })
    }
}
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

    renderComment(author, body){
        const container = document.createElement('div');
        container.classList.add('image-comment');

        const authorSpan = document.createElement('span');
        authorSpan.classList.add('image-comment-author');
        authorSpan.textContent = author + ': ';
        container.appendChild(authorSpan);

        const bodySpan = document.createElement('span');
        bodySpan.classList.add('image-comment-body');
        bodySpan.textContent = body;
        container.appendChild(bodySpan);

        return container;
    }

    updateModalData(card){
        return connection.getCard(card.dataset.id)
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

                for (const tag of cardData.tags){
                    const span = document.createElement('span');
                    span.textContent = '#' + tag;
                    this.tags.appendChild(span);
                }

                for (const comment of cardData.commentsList){
                    this.commentsList.appendChild(this.renderComment(comment.author, comment.body));
                }
            });


    }

    showPic(card){
        this.id = card.dataset.id;
        this.updateModalData(card)
            .then( ()=>{
                this.open();
            } );
    }

    open(){
        this.img = this.pic.querySelector('img');
        super.open();
    }

    close(){
        this.pic.textContent = '';
        this.likes.textContent = '';
        this.comments.textContent = '';
        this.seen.textContent = '';
        this.art.textContent = '';
        this.author.textContent = '';
        this.postDate.textContent = '';
        this.tags.textContent = '';
        this.commentsList.textContent = '';
        this.description.textContent = '';
        super.close();
    }

    init(){
        document.querySelector('.js-art-on').addEventListener('click', e => {
            const img = this.pic;
            const artTools = this.modal.querySelector('.image-art');
            const art = new Art(img, artTools);
            art.init();
            connection.updArtState(true, this.id);
        });
        document.querySelector('.js-art-off').addEventListener('click', e => {
            this.pic.textContent = '';
            this.pic.appendChild(this.img);
            connection.updArtState(null);
        });
        super.init();
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









