'use strict';

function wrt(d) {
  console.log(d);
}

window.editor = {
  events: {},
  addEventListener(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  removeEventListener(event) {
    if (this.events[event]) {
      this.events[event] = [];
    }
  },
  emit(event, data) {
    if (!this.events[event]) {
      return;
    }
    this.events[event]
      .forEach(callback => callback.call(this, data));
  }
};


function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
    deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

function findTargetInPath(className, path) {
  for (const curr of path) {
    if (curr.classList.contains(className)) {
      return curr;
    } else if (curr.tagName === 'BODY') {
      return null;
    }
  }
}

function composedPath (el) {

  var path = [];

  while (el) {

    path.push(el);

    if (el.tagName === 'HTML') {

      path.push(document);
      path.push(window);

      return path;
    }

    el = el.parentElement;
  }
}


/****************************************/
/*************Функционал модалки*********/

/****************************************/
class Modal {
  constructor(modal) {
    this.modal = modal;
    this.docBody = document.querySelector('body');
  }

  closeAnimEnd() {
    if (this.modal.classList.contains('fadeIn')) {
      this.modal.classList.remove('fadeIn');
      this.docBody.classList.add('modal-opened');
    } else if (this.modal.classList.contains('fadeOut')) {
      this.modal.style.display = 'none';
      this.modal.classList.remove('fadeOut');
      this.docBody.classList.remove('modal-opened');
    }
  }

  open() {
    this.modal.style.display = 'flex';
    this.modal.classList.remove('fadeOut');
    this.modal.classList.add('fadeIn');
  }

  close() {
    this.modal.classList.remove('fadeIn');
    this.modal.classList.add('fadeOut');
  }

  init() {
    this.modal.querySelector('.js-modal-close').addEventListener('click', () => {
      this.close();
    });
    this.modal.addEventListener("webkitAnimationEnd", () => {
      this.closeAnimEnd();
    });
    this.modal.addEventListener("animationend", () => {
      this.closeAnimEnd();
    });
    window.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.close();
      }
    })
  }
}

/****************************************/


/****************************************/
/****************Прелоадер***************/

/****************************************/
class Preloader extends Modal {
  constructor() {
    super(document.createElement('div'));
    this.modal.classList.add('preloader', 'modal');

    const img = new Image();
    img.src = 'https://raw.githubusercontent.com/Avonavi232/HJ-15-d/master/res/preloader.gif';
    this.modal.appendChild(img);
    document.querySelector('body').appendChild(this.modal);
    this.init();
  }

  init() {
    this.modal.addEventListener("webkitAnimationEnd", () => {
      this.closeAnimEnd();
    });
    this.modal.addEventListener("animationend", () => {
      this.closeAnimEnd();
    });
  }
}

const preloader = new Preloader();
/****************************************/


/****************************************/
/*******имитация ответов сервера*********/

/****************************************/
class Server {
  constructor() {
    this.art = null;
    this.baseurl = 'https://neto-api.herokuapp.com/yellowgallery/';
    this.oldurl = './src/js/feed.json';
    this.wssBaseUrl = 'wss://neto-api.herokuapp.com/yellowgallery/';
  }


  //Метод отдает всю ленту (массив объектов)
  getFeed() {
    return fetch(this.baseurl, {
      method: 'GET'
    });
  }


  //Метод отдает одну карточку по id (объект)
  getCard(id) {
    return fetch(this.baseurl + id, {
      method: 'GET'
    })
      .then(res => res.json());
  }


  //Код общения с сервером
  uploadItem(formdata) {
    return fetch(this.baseurl, {
      method: 'POST',
      body: formdata
    })
      .then(res => res.json());
  }


  likeItem(id) {
    if (!id) return;
    const randInt = Math.floor(Math.random() * 10);
    return fetch(this.baseurl + id + '/likes/' + randInt, {
      method: 'PUT'
    })
      .then(res => res.json());
  }


  commentItem(id, uid, message) {
    if (!id) return;
    return fetch(this.baseurl + id + '/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'uid=' + encodeURIComponent(uid) + '&message=' + encodeURIComponent(message)
    })
      .then(res => res.json());
  }


  seeItem(id) {
    if (!id) return;
    return fetch(this.baseurl + id + '/seen/' + Date.now(), {
      method: 'PUT',
    })
      .then(res => res.json());
  }


  artInit(id) {
    const socket = new WebSocket(this.wssBaseUrl + id);

    socket.addEventListener('open', () => {
      wrt("Соединение установлено.");
    });


    socket.addEventListener('close', event => {
      if (event.wasClean) {
        wrt('Соединение закрыто чисто');
      } else {
        wrt('Обрыв соединения'); // например, "убит" процесс сервера
      }
      wrt('Код: ' + event.code + ' причина: ' + event.reason);
    });


    socket.addEventListener('message', function (event) {
      wrt("Получены данные ");
      wrt(JSON.parse(event.data));
    });

    socket.addEventListener('error', error => {
      wrt("Ошибка " + error.message);
      this.socket = null;
    });

    return socket;
  }

  getMask(id) {
    if (!id) return;

    return new Promise((resolve, reject) => {
      fetch('https://neto-api.herokuapp.com/yellowgallery/' + id + '/mask/' + Date.now(), {
        method: 'GET'
      })
        .then(res => {
          if (200 <= res.status && res.status < 300) {
            resolve(res.blob());
          } else {
            reject();
          }
        });
    })
  }

  sendCanvas(canvas, id) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        const formdata = new FormData();
        formdata.append('image', blob);
        fetch(this.baseurl + id + '/mask ', {
          method: 'PUT',
          body: formdata
        })
          .then(res => {
            resolve(res.json());
          });
      });
    })
  }

  sendCanvasSocket(canvas, socket) {
    canvas.toBlob(blob => {
      socket.send(blob);
    });
  }

}

const connection = new Server();


/****************************************/


/****************************************/
/******Поведение сайдбара модалки********/

/****************************************/
class ImageSidebar {
  constructor(classes) {
    this.sidebar = document.querySelector('.' + classes.sidebar);
    this.art = document.querySelector('.' + classes.art);
    this.descr = document.querySelector('.' + classes.descr);
    this.state = true;

    this.toggleButtons = document.querySelectorAll('.js-image-sidebar-toggle');
  }

  toggle() {
    if (this.state) {
      this.descr.style.transform = 'translateX(600px)';
      this.art.style.transform = 'translateX(0px)';
      this.state = false;
    } else {
      this.descr.style.transform = 'translateX(0px)';
      this.art.style.transform = 'translateX(-600px)';
      this.state = true;
    }
  }

  sidebarToggleHandler = (e) => {
    const path = e.path || (e.composedPath && e.composedPath()) || composedPath(e.target);
    findTargetInPath('js-image-sidebar-toggle', path) ? this.toggle() : null;
  };

  init(){
    this.sidebar.addEventListener('click', this.sidebarToggleHandler);
  }
}

//Инициализируем поведение сайдбара при просмотре картинки
const imageSidebar = new ImageSidebar({
  sidebar: 'image-sidebar',
  art: 'image-art',
  descr: 'image-infoblock'
});
imageSidebar.init();
/****************************************/


/****************************************/
/*************ImageLoader****************/

/****************************************/
class ImageLoader {
  constructor(dropArea) {
    this.dropArea = dropArea;
    this.dropAreaInner = this.dropArea.firstElementChild;
    this.inputReplacer = document.querySelector('.js-upload-input-replacer');
    this.input = document.querySelector('.js-upload-input');
    this.preview = document.querySelector('.js-upload-image-preview');

    this.form = document.querySelector('.js-upload-form');
    this.imgToUpload = null;

    this.modalOpenBtn = document.querySelector('.js-upload-pic-btn');
    this.modalUploadCancelBtn = document.querySelector('.js-upload-cancel');
    this.modalUploadSubmitBtn = document.querySelector('.js-upload-form-submit');
    this.modal = new Modal(document.querySelector('.js-upload-modal'));
    this.modal.init();

    this.errorField = document.querySelector('.js-error');
  }

  //Поля формы, которые генерируются кодом и не существуют в момент создания экземпляра ImageLoader
  get uidInput() {
    return this.form.querySelector('.js-upload-uid');
  }

  get descrInput() {
    return this.form.querySelector('.js-upload-description');
  }

  //методы управления превьюшкой
  getPreviewImg(files) {
    if (!files.length) return; //если массив пустой - выходим
    if (files[0].type.indexOf('image') === -1) return; //если не картинка - выходим
    return URL.createObjectURL(files[0]);
  }

  showPreviewImg(src) {
    const img = document.createElement('img');
    img.src = src;
    img.addEventListener('load', event => {
      URL.revokeObjectURL(event.target.src);
    });
    this.removePreviewImg();
    this.preview.appendChild(img);
  }

  removePreviewImg() {
    this.preview.textContent = '';
  }


  showPreviewInfo() {
    const container = document.createElement('form');
    container.classList.add('upload-infoblock');


    const uidContainer = document.createElement('div');
    uidContainer.classList.add('justified');
    container.appendChild(uidContainer);

    const uidLabel = document.createElement('label');
    uidLabel.setAttribute('for', 'label-upload-uid');
    uidLabel.textContent = 'Опубликовать от имени автора:';
    uidContainer.appendChild(uidLabel);

    const uidInput = document.createElement('input');
    uidInput.id = 'label-upload-uid';
    uidInput.name = 'uid';
    uidInput.classList.add('js-upload-uid');
    uidContainer.appendChild(uidInput);


    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('justified');
    container.appendChild(descriptionContainer);

    const descriptionLabel = document.createElement('label');
    descriptionLabel.setAttribute('for', 'label-upload-description');
    descriptionLabel.textContent = 'Описание изображения:';
    descriptionContainer.appendChild(descriptionLabel);

    const descriptionInput = document.createElement('textarea');
    descriptionInput.id = 'label-upload-description';
    descriptionInput.name = 'description';
    descriptionInput.classList.add('js-upload-description');
    descriptionContainer.appendChild(descriptionInput);

    this.preview.appendChild(container);
  }


  //При отмене загрузик подчищаем превью и закрываем модалку
  uploadCancel() {
    this.modal.close();
    this.removePreviewImg();
  }


  upload() {
    if (!this.imgToUpload) {
      this.errorField.textContent = 'Attach an image!';
      return;
    }
    if (!this.uidInput.value) {
      this.errorField.textContent = 'Enter the UID!';
      return;
    }
    if (this.imgToUpload.type.indexOf('png') === -1) {
      this.errorField.textContent = 'You can only upload an PNG image';
      return;
    }

    preloader.open();

    const formdata = new FormData(this.preview.querySelector('form'));
    formdata.append('image', this.imgToUpload);

    connection.uploadItem(formdata)
      .then( () => {
        preloader.close();
        this.modal.close();
        this.removePreviewImg();
      });
  }


  init() {
    //Обработка загрузки картинки через инпут
    this.input.addEventListener('change', e => {
      e.preventDefault();

      if (e.target.files[0].type.indexOf('png') === -1) {
        this.errorField.textContent = 'You can only upload an PNG image';
        return;
      } else this.errorField.textContent = '';

      this.imgToUpload = e.target.files[0];
      const src = this.getPreviewImg(e.currentTarget.files);
      this.showPreviewImg(src);
      this.showPreviewInfo();
    });


    //Обработка дропа картинки
    this.dropArea.addEventListener('drop', e => {
      e.preventDefault();

      if (e.dataTransfer.files[0].type.indexOf('png') === -1) {
        this.errorField.textContent = 'You can only upload an PNG image';
        return;
      } else this.errorField.textContent = '';

      const src = this.getPreviewImg(e.dataTransfer.files);
      this.imgToUpload = e.dataTransfer.files[0];

      this.showPreviewImg(src);
      this.showPreviewInfo();

      //Уберем стилизующий класс
      this.dropArea.classList.remove('upload-modal__drop-area_dragover');
    });


    //Стилизация области дропа при dragover
    this.dropArea.addEventListener('dragover', e => {
      e.preventDefault();

      if (e.target === this.dropArea || e.target === this.dropAreaInner) {
        this.dropArea.classList.add('upload-modal__drop-area_dragover');
      }
    });


    //Делегируем клик по заменителю инпута самому инпуту
    this.inputReplacer.addEventListener('click', () => {
      this.input.click();
    });


    //Делегируем клик по дропзоне инпуту
    this.dropArea.addEventListener('click', () => {
      this.input.click();
    });


    //Открываем модалку-загрузчик по клику на соотв.кнопке
    this.modalOpenBtn.addEventListener('click', () => {
      this.modal.open();
    });


    //Обработка отмены загрузки
    this.modalUploadCancelBtn.addEventListener('click', () => {
      this.uploadCancel();
    });


    //Обработка подтверждения загрузки
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.upload();
    });
  }
}

const dropArea = new ImageLoader(document.querySelector('.js-drop-area'));
dropArea.init();
/****************************************/


/****************************************/
/****************FEED********************/

/****************************************/
class Feed {
  static get feed() {
    return document.querySelector('.js-feed');
  }

  //Методы для создания карточки-миниатюры
  static createStat(className, stat) {
    const td = document.createElement('td');

    const p = document.createElement('p');
    p.classList.add('stat');
    td.appendChild(p);

    const icon = document.createElement('span');
    icon.classList.add(className);
    p.appendChild(icon);

    const title = document.createElement('span');
    title.textContent = stat;
    p.appendChild(title);

    return td;
  }

  static createCard(card) {
    const likes = card.likes ? Object.keys(card.likes).length : 0;
    const comments = card.comments ? Object.keys(card.comments).length : 0;
    const seen = card.seen ? Object.keys(card.seen).length : 0;
    const art = card.art ? Object.keys(card.art).length : 0;


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
    row.appendChild(Feed.createStat('icon-heart', likes));
    row.appendChild(Feed.createStat('icon-bubble', comments));
    table.appendChild(row.cloneNode(true));

    row.textContent = '';
    row.appendChild(Feed.createStat('icon-eye', seen));
    row.appendChild(Feed.createStat('icon-pencil', art));
    table.appendChild(row);

    const img = document.createElement('img');
    img.src = card.url;
    container.appendChild(img);

    return container;
  }

  static renderFeed(feed) {
    let counter = 0;
    const fragment = document.createDocumentFragment();
    for (const card of feed) {
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

  static updFeed() {
    preloader.open();
    connection.getFeed()
      .then(res => res.json())
      .then(feed => Feed.renderFeed(feed))
      .then(() => preloader.close());
  }
}

Feed.updFeed();

/****************************************/


/****************************************/
/***********Творческий режим*************/

/****************************************/
class Art {
  constructor(controls, parentModal) {
    this.parentModal = parentModal;
    this.imgContainer = this.parentModal.pic;
    this.img = this.imgContainer.querySelector('img');
    this.id = this.parentModal.id;

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
    this.mouseHolded = false; //состояние левой кн. мыши (нажато/не нажато)

    this.socket = connection.artInit(this.id);
    this.socket.addEventListener('close', () => {
      this.socket = null;
    });
    this.socket.addEventListener('error', () => {
      this.socket = null;
    });

    this.artIsActive = true;
    this.eventListeners = [];

    this.init();
  }

  repaint() {
    //Функция перерисовки всей канвы
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const curve of this.curves) {
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

  smoothCurveBetween(p1, p2) {
    //Функция добавляет точку для квадратичной кривой Bezier
    const cpx = ( p1[0] + p2[0] ) / 2;
    const cpy = ( p1[1] + p2[1] ) / 2;
    this.ctx.quadraticCurveTo(p1[0], p1[1], cpx, cpy);
  }

  smoothCurve(points) {
    this.ctx.beginPath();

    this.ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length - 1; i++) {
      this.smoothCurveBetween(points[i], points[i + 1]);
    }

    this.ctx.strokeStyle = points[points.length - 1][2];
    this.ctx.lineWidth = points[points.length - 1][3];
    this.ctx.stroke();
  }

  tick() {
    this.shiftPressedControl();

    if (this.needsRepaint) {
      this.repaint();
      this.needsRepaint = false;
    }
    window.requestAnimationFrame(() => {
      if (this.artIsActive)
        this.tick();
    });
  }

  shiftPressedControl() {
    //Следим за нажатием Shift, состояние храним в переменной shiftPressed
    document.addEventListener('keydown', e => {
      e.shiftKey ? this.shiftPressed = 1 : this.shiftPressed = 0;
    });
    document.addEventListener('keyup', e => {
      e.shiftKey ? this.shiftPressed = 1 : this.shiftPressed = 0;
    });
  }

  checkBoundaries(target) {
    if (target !== this.canvas)
      return 0;
    return 1;
  }


  createMask(maskLink) {
    const img = new Image();
    const urlCreator = window.URL || window.webkitURL;
    img.src = maskLink;
    img.crossOrigin = "Anonymous";
    img.classList.add('js-mask');
    img.style.width = this.canvas.width + 'px';
    img.style.height = this.canvas.height + 'px';

    return img;
  }

  updMask(maskLink) {
    const maskImg = this.createMask(maskLink);
    const oldMaskImg = this.imgContainer.querySelector('.js-mask');

    //если есть старая маска, то ее надо удалить
    if (oldMaskImg)
      oldMaskImg.remove();

    this.imgContainer.insertBefore(maskImg, this.canvas);
  }

  sendMask(mask){
    mask.toBlob(blob => {
      if (this.socket)
        this.socket.send(blob);
    });
  }

  createMaskLink(link){
    return link.substr(0, (link.indexOf('nocache') - 1));
  }


  stopArt() {
    //здесь надо написать выключение арт-режима
    if (this.socket)
      this.socket.close();
      delete this.socket;
    this.artIsActive = false;

    //отписка от использующих сокет событий событий
    if (this.eventListeners.length) {
      this.eventListeners.forEach(function (event) {
        event.object.removeEventListener(event.type, event.listener);
      });
    }
  }


  mergeCanvasWithMask(mask) {
    const mergedCanvas = this.canvas.cloneNode(false);
    const ctx = mergedCanvas.getContext('2d');
    ctx.drawImage(mask, 0, 0);
    return mergedCanvas;
  }

  canvasUpdateHandler(canvas) {
    //отправить маску, если сокет готов
    if (this.socket && this.socket.readyState === 1) {
      const mask = this.imgContainer.querySelector('.js-mask');

      //Если маски нет, то отправляем один канвас, если есть - то сначала объединяем
      const maskToSend = mask ? this.mergeCanvasWithMask(mask) : canvas;

      this.sendMask(maskToSend);
    }
  };


  socketMessageHandler(event) {
    const data = JSON.parse(event.data);
    if (data.event === 'mask') {
      const link = data.url;
      //Ссылка, приходящая в сокете, просто так почему-то не работает
      const maskLink = this.createMaskLink(link);
      this.updMask(maskLink);
    }
  };

  init() {
    this.imgContainer.appendChild(this.canvas);
    this.shiftPressedControl(); //запускаем слежение за shift


    window.addEventListener('resize', () => {
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    });

    this.canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      this.mouseHolded = true;
      const curve = [];
      curve.push([e.offsetX, e.offsetY, this.brushColor, this.brushWidth]);
      (this.curves).push(curve);
      this.needsRepaint = true;
    });

    document.addEventListener('mouseup', () => {
      if (this.mouseHolded) {
        window.editor.emit('update', this.canvas);
        this.mouseHolded = false;
      }
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
      this.curves = [];
    });

    this.brushColorInput.addEventListener('change', e => {
      this.brushColor = e.target.value;
    });
    this.brushWidthInput.addEventListener('change', e => {
      this.brushWidth = e.target.value;
    });

    //Отправить маску по событию update на канвасе
    const bindedCanvasUpdateHandler = this.canvasUpdateHandler.bind(this);
    this.eventListeners.push({
      object: window.editor,
      type: 'update',
      listener: bindedCanvasUpdateHandler
    }); //нужно, чтоб при закрытии арт-режима отписаться от события
    window.editor.addEventListener('update', bindedCanvasUpdateHandler);

    //получить и подставить маску, если сокет ее присылает
    if (this.socket) {
      const bindedSocketMessageHandler = this.socketMessageHandler.bind(this);
      this.eventListeners.push({
        object: this.socket,
        type: 'message',
        listener: bindedSocketMessageHandler
      });
      this.socket.addEventListener('message', bindedSocketMessageHandler);
    }

    //тестовый код, отправляющий маску по нажатию на кнопку
    // document.querySelector('.test-button').addEventListener('click', () => {
    //   const mask = this.imgContainer.querySelector('.js-mask');
    //   const maskToSend = mask ? this.mergeCanvasWithMask(mask) : this.canvas;
    //   this.sendMask(maskToSend);
    // });

    //запуск рисовалки
    this.tick();
  }
}

/****************************************/


/****************************************/
/***********Модалка просмотрщик**********/

/****************************************/
class ShowPicModal extends Modal {
  constructor(modal) {
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

    this.commentForm = modal.querySelector('.js-comment-form');
    this.commentUID = modal.querySelector('.js-comment-uid');
    this.commentUID.value = localStorage.getItem('YellowGalleryUserName') || '';
    this.errorField = modal.querySelector('.js-comment-error');

    this.commentMessage = modal.querySelector('.js-comment-message');
    this.controlsInited = false;

    this.id = null; //будет хранить id картинки, когда модалка открыта.
    this.controlsInited = false; //хранит состояние initControls

    this.artObject = null; //При инициализации арт режима будет хранить экземпляр Art

    this.hasMask = false;
  }


  renderComment(author, body) {
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


  updateModalStatsComments(id) {
    return connection.getCard(id)
      .then(cardData => {
        //Статы
        this.likes.textContent = cardData.likes ? Object.keys(cardData.likes).length : 0;
        this.comments.textContent = cardData.comments ? Object.keys(cardData.comments).length : 0;
        this.seen.textContent = cardData.seen ? Object.keys(cardData.seen).length : 0;
        this.art.textContent = cardData.art ? Object.keys(cardData.art).length : 0;

        this.commentsList.textContent = '';
        for (const commentKey in cardData.comments) {
          this.commentsList.appendChild(this.renderComment(cardData.comments[commentKey].uid, cardData.comments[commentKey].message));
        }
      });
  }


  updateModalData(card) {
    return connection.getCard(card.dataset.id)
      .then(cardData => {
        //Картинка
        this.pic.textContent = '';
        const img = document.createElement('img');
        img.src = cardData.url;
        this.pic.appendChild(img);
        return cardData;
      })
      .then(cardData => {
        //Статы
        this.likes.textContent = cardData.likes ? Object.keys(cardData.likes).length : 0;
        this.comments.textContent = cardData.comments ? Object.keys(cardData.comments).length : 0;
        this.seen.textContent = cardData.seen ? Object.keys(cardData.seen).length : 0;
        this.art.textContent = cardData.art ? Object.keys(cardData.art).length : 0;
        return cardData;
      })
      .then(cardData => {
        //Остальное
        this.author.textContent = cardData.uid;
        this.postDate.textContent = new Date(cardData.timestamp).toLocaleString();
        this.description.textContent = cardData.description;

        if (cardData.hasOwnProperty('mask')) {
          this.hasMask = true;
        }

        //Комменты
        for (const commentKey in cardData.comments) {
          this.commentsList.appendChild(this.renderComment(cardData.comments[commentKey].uid, cardData.comments[commentKey].message));
        }
      });
  }


  showPic(card) {
    preloader.open();
    this.id = card.dataset.id;
    connection.seeItem(this.id)
      .then(() => {
        this.updateModalData(card)
          .then(() => {
            if (!this.controlsInited) {
              this.initControls();
              this.controlsInited = true;
            }
          })
          .then(() => {
            this.open();
          })
          .then(() => {
            preloader.close();
          });
      });

  }


  open() {
    this.img = this.pic.querySelector('img');
    super.open();
  }


  close() {
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
    this.controlsInited = false;

    if (this.artObject) {
      this.artObject.stopArt();
    }
    super.close();
  }


  initControls() {
    if (this.controlsInited) return;
    this.modal.querySelector('.js-image-like').addEventListener('click', e => {
      e.preventDefault();
      preloader.open();
      connection.likeItem(this.id)
        .then(() => {
          this.updateModalStatsComments(this.id)
            .then(() => {
              preloader.close();
            });
        });
    });

    this.commentForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!this.commentUID.value || !this.commentMessage.value) {
        this.errorField.textContent = 'Не все поля заполнены';
        return;
      } else this.errorField.textContent = '';

      preloader.open();

      localStorage.setItem('YellowGalleryUserName', this.commentUID.value);

      connection.commentItem(this.id, this.commentUID.value, this.commentMessage.value)
        .then(() => {
          this.updateModalStatsComments(this.id);
          this.commentMessage.value = '';
          preloader.close();
        });
    });
  }


  init() {
    document.querySelector('.js-art-on').addEventListener('click', e => {
      const img = this.pic;
      const artTools = this.modal.querySelector('.image-art');
      this.artObject = new Art(artTools, this);
    });
    document.querySelector('.js-art-off').addEventListener('click', e => {
      this.pic.textContent = '';
      this.pic.appendChild(this.img);
      this.artObject.stopArt();
      this.artObject.active = false;
    });
    super.init();
  }
}

const showPicModal = new ShowPicModal(document.querySelector('.js-show-pic-modal'));
showPicModal.init();

//Ловим клик по миниатюре, используя делегирование событий
document.querySelector('.js-feed').addEventListener('click', (e) => {
  const path = e.path || (e.composedPath && e.composedPath()) || composedPath(e.target);
  const target = findTargetInPath('card-thumbnail', path);
  target ? showPicModal.showPic(target) : null;
});

/****************************************/








