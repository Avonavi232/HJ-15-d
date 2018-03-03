'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function wrt(d) {
  console.log(d);
}

window.editor = {
  events: {},
  addEventListener: function addEventListener(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  removeEventListener: function removeEventListener(event) {
    if (this.events[event]) {
      this.events[event] = [];
    }
  },
  emit: function emit(event, data) {
    var _this = this;

    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach(function (callback) {
      return callback.call(_this, data);
    });
  }
};

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last, deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date(),
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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var curr = _step.value;

      if (curr.classList.contains(className)) {
        return curr;
      } else if (curr.tagName === 'BODY') {
        return null;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function composedPath(el) {

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

var Modal = function () {
  function Modal(modal) {
    _classCallCheck(this, Modal);

    this.modal = modal;
    this.docBody = document.querySelector('body');
  }

  _createClass(Modal, [{
    key: 'closeAnimEnd',
    value: function closeAnimEnd() {
      if (this.modal.classList.contains('fadeIn')) {
        this.modal.classList.remove('fadeIn');
        this.docBody.classList.add('modal-opened');
      } else if (this.modal.classList.contains('fadeOut')) {
        this.modal.style.display = 'none';
        this.modal.classList.remove('fadeOut');
        this.docBody.classList.remove('modal-opened');
      }
    }
  }, {
    key: 'open',
    value: function open() {
      this.modal.style.display = 'flex';
      this.modal.classList.remove('fadeOut');
      this.modal.classList.add('fadeIn');
    }
  }, {
    key: 'close',
    value: function close() {
      this.modal.classList.remove('fadeIn');
      this.modal.classList.add('fadeOut');
    }
  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.modal.querySelector('.js-modal-close').addEventListener('click', function () {
        _this2.close();
      });
      this.modal.addEventListener("webkitAnimationEnd", function () {
        _this2.closeAnimEnd();
      });
      this.modal.addEventListener("animationend", function () {
        _this2.closeAnimEnd();
      });
      window.addEventListener('click', function (e) {
        if (e.target === _this2.modal) {
          _this2.close();
        }
      });
    }
  }]);

  return Modal;
}();

/****************************************/

/****************************************/
/****************Прелоадер***************/

/****************************************/


var Preloader = function (_Modal) {
  _inherits(Preloader, _Modal);

  function Preloader() {
    _classCallCheck(this, Preloader);

    var _this3 = _possibleConstructorReturn(this, (Preloader.__proto__ || Object.getPrototypeOf(Preloader)).call(this, document.createElement('div')));

    _this3.modal.classList.add('preloader', 'modal');

    var img = new Image();
    img.src = 'https://raw.githubusercontent.com/Avonavi232/HJ-15-d/master/res/preloader.gif';
    _this3.modal.appendChild(img);
    document.querySelector('body').appendChild(_this3.modal);
    _this3.init();
    return _this3;
  }

  _createClass(Preloader, [{
    key: 'init',
    value: function init() {
      var _this4 = this;

      this.modal.addEventListener("webkitAnimationEnd", function () {
        _this4.closeAnimEnd();
      });
      this.modal.addEventListener("animationend", function () {
        _this4.closeAnimEnd();
      });
    }
  }]);

  return Preloader;
}(Modal);

var preloader = new Preloader();
/****************************************/

/****************************************/
/*******имитация ответов сервера*********/

/****************************************/

var Server = function () {
  function Server() {
    _classCallCheck(this, Server);

    this.art = null;
    this.baseurl = 'https://neto-api.herokuapp.com/yellowgallery/';
    this.oldurl = './src/js/feed.json';
    this.wssBaseUrl = 'wss://neto-api.herokuapp.com/yellowgallery/';
  }

  //Метод отдает всю ленту (массив объектов)


  _createClass(Server, [{
    key: 'getFeed',
    value: function getFeed() {
      return fetch(this.baseurl, {
        method: 'GET'
      });
    }

    //Метод отдает одну карточку по id (объект)

  }, {
    key: 'getCard',
    value: function getCard(id) {
      return fetch(this.baseurl + id, {
        method: 'GET'
      }).then(function (res) {
        return res.json();
      });
    }

    //Код общения с сервером

  }, {
    key: 'uploadItem',
    value: function uploadItem(formdata) {
      return fetch(this.baseurl, {
        method: 'POST',
        body: formdata
      }).then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'likeItem',
    value: function likeItem(id) {
      if (!id) return;
      var randInt = Math.floor(Math.random() * 10);
      return fetch(this.baseurl + id + '/likes/' + randInt, {
        method: 'PUT'
      }).then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'commentItem',
    value: function commentItem(id, uid, message) {
      if (!id) return;
      return fetch(this.baseurl + id + '/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'uid=' + encodeURIComponent(uid) + '&message=' + encodeURIComponent(message)
      }).then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'seeItem',
    value: function seeItem(id) {
      if (!id) return;
      return fetch(this.baseurl + id + '/seen/' + Date.now(), {
        method: 'PUT'
      }).then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'artInit',
    value: function artInit(id) {
      var _this5 = this;

      var socket = new WebSocket(this.wssBaseUrl + id);

      socket.addEventListener('open', function () {
        wrt("Соединение установлено.");
      });

      socket.addEventListener('close', function (event) {
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

      socket.addEventListener('error', function (error) {
        wrt("Ошибка " + error.message);
        _this5.socket = null;
      });

      return socket;
    }
  }, {
    key: 'getMask',
    value: function getMask(id) {
      if (!id) return;

      return new Promise(function (resolve, reject) {
        fetch('https://neto-api.herokuapp.com/yellowgallery/' + id + '/mask/' + Date.now(), {
          method: 'GET'
        }).then(function (res) {
          if (200 <= res.status && res.status < 300) {
            resolve(res.blob());
          } else {
            reject();
          }
        });
      });
    }
  }, {
    key: 'sendCanvas',
    value: function sendCanvas(canvas, id) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
          var formdata = new FormData();
          formdata.append('image', blob);
          fetch(_this6.baseurl + id + '/mask ', {
            method: 'PUT',
            body: formdata
          }).then(function (res) {
            resolve(res.json());
          });
        });
      });
    }
  }, {
    key: 'sendCanvasSocket',
    value: function sendCanvasSocket(canvas, socket) {
      canvas.toBlob(function (blob) {
        socket.send(blob);
      });
    }
  }]);

  return Server;
}();

var connection = new Server();

/****************************************/

/****************************************/
/******Поведение сайдбара модалки********/

/****************************************/

var ImageSidebar = function () {
  function ImageSidebar(classes) {
    var _this7 = this;

    _classCallCheck(this, ImageSidebar);

    this.sidebarToggleHandler = function (e) {
      var path = e.path || e.composedPath && e.composedPath() || composedPath(e.target);
      findTargetInPath('js-image-sidebar-toggle', path) ? _this7.toggle() : null;
    };

    this.sidebar = document.querySelector('.' + classes.sidebar);
    this.art = document.querySelector('.' + classes.art);
    this.descr = document.querySelector('.' + classes.descr);
    this.state = true;

    this.toggleButtons = document.querySelectorAll('.js-image-sidebar-toggle');
  }

  _createClass(ImageSidebar, [{
    key: 'toggle',
    value: function toggle() {
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
  }, {
    key: 'init',
    value: function init() {
      this.sidebar.addEventListener('click', this.sidebarToggleHandler);
    }
  }]);

  return ImageSidebar;
}();

//Инициализируем поведение сайдбара при просмотре картинки


var imageSidebar = new ImageSidebar({
  sidebar: 'image-sidebar',
  art: 'image-art',
  descr: 'image-infoblock'
});
imageSidebar.init();
/****************************************/

/****************************************/
/*************ImageLoader****************/

/****************************************/

var ImageLoader = function () {
  function ImageLoader(dropArea) {
    _classCallCheck(this, ImageLoader);

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


  _createClass(ImageLoader, [{
    key: 'getPreviewImg',


    //методы управления превьюшкой
    value: function getPreviewImg(files) {
      if (!files.length) return; //если массив пустой - выходим
      if (files[0].type.indexOf('image') === -1) return; //если не картинка - выходим
      return URL.createObjectURL(files[0]);
    }
  }, {
    key: 'showPreviewImg',
    value: function showPreviewImg(src) {
      var img = document.createElement('img');
      img.src = src;
      img.addEventListener('load', function (event) {
        URL.revokeObjectURL(event.target.src);
      });
      this.removePreviewImg();
      this.preview.appendChild(img);
    }
  }, {
    key: 'removePreviewImg',
    value: function removePreviewImg() {
      this.preview.textContent = '';
    }
  }, {
    key: 'showPreviewInfo',
    value: function showPreviewInfo() {
      var container = document.createElement('form');
      container.classList.add('upload-infoblock');

      var uidContainer = document.createElement('div');
      uidContainer.classList.add('justified');
      container.appendChild(uidContainer);

      var uidLabel = document.createElement('label');
      uidLabel.setAttribute('for', 'label-upload-uid');
      uidLabel.textContent = 'Опубликовать от имени автора:';
      uidContainer.appendChild(uidLabel);

      var uidInput = document.createElement('input');
      uidInput.id = 'label-upload-uid';
      uidInput.name = 'uid';
      uidInput.classList.add('js-upload-uid');
      uidContainer.appendChild(uidInput);

      var descriptionContainer = document.createElement('div');
      descriptionContainer.classList.add('justified');
      container.appendChild(descriptionContainer);

      var descriptionLabel = document.createElement('label');
      descriptionLabel.setAttribute('for', 'label-upload-description');
      descriptionLabel.textContent = 'Описание изображения:';
      descriptionContainer.appendChild(descriptionLabel);

      var descriptionInput = document.createElement('textarea');
      descriptionInput.id = 'label-upload-description';
      descriptionInput.name = 'description';
      descriptionInput.classList.add('js-upload-description');
      descriptionContainer.appendChild(descriptionInput);

      this.preview.appendChild(container);
    }

    //При отмене загрузик подчищаем превью и закрываем модалку

  }, {
    key: 'uploadCancel',
    value: function uploadCancel() {
      this.modal.close();
      this.removePreviewImg();
    }
  }, {
    key: 'upload',
    value: function upload() {
      var _this8 = this;

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

      var formdata = new FormData(this.preview.querySelector('form'));
      formdata.append('image', this.imgToUpload);

      connection.uploadItem(formdata).then(function () {
        preloader.close();
        _this8.modal.close();
        _this8.removePreviewImg();
      });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this9 = this;

      //Обработка загрузки картинки через инпут
      this.input.addEventListener('change', function (e) {
        e.preventDefault();

        if (e.target.files[0].type.indexOf('png') === -1) {
          _this9.errorField.textContent = 'You can only upload an PNG image';
          return;
        } else _this9.errorField.textContent = '';

        _this9.imgToUpload = e.target.files[0];
        var src = _this9.getPreviewImg(e.currentTarget.files);
        _this9.showPreviewImg(src);
        _this9.showPreviewInfo();
      });

      //Обработка дропа картинки
      this.dropArea.addEventListener('drop', function (e) {
        e.preventDefault();

        if (e.dataTransfer.files[0].type.indexOf('png') === -1) {
          _this9.errorField.textContent = 'You can only upload an PNG image';
          return;
        } else _this9.errorField.textContent = '';

        var src = _this9.getPreviewImg(e.dataTransfer.files);
        _this9.imgToUpload = e.dataTransfer.files[0];

        _this9.showPreviewImg(src);
        _this9.showPreviewInfo();

        //Уберем стилизующий класс
        _this9.dropArea.classList.remove('upload-modal__drop-area_dragover');
      });

      //Стилизация области дропа при dragover
      this.dropArea.addEventListener('dragover', function (e) {
        e.preventDefault();

        if (e.target === _this9.dropArea || e.target === _this9.dropAreaInner) {
          _this9.dropArea.classList.add('upload-modal__drop-area_dragover');
        }
      });

      //Делегируем клик по заменителю инпута самому инпуту
      this.inputReplacer.addEventListener('click', function () {
        _this9.input.click();
      });

      //Делегируем клик по дропзоне инпуту
      this.dropArea.addEventListener('click', function () {
        _this9.input.click();
      });

      //Открываем модалку-загрузчик по клику на соотв.кнопке
      this.modalOpenBtn.addEventListener('click', function () {
        _this9.modal.open();
      });

      //Обработка отмены загрузки
      this.modalUploadCancelBtn.addEventListener('click', function () {
        _this9.uploadCancel();
      });

      //Обработка подтверждения загрузки
      this.form.addEventListener('submit', function (e) {
        e.preventDefault();
        _this9.upload();
      });
    }
  }, {
    key: 'uidInput',
    get: function get() {
      return this.form.querySelector('.js-upload-uid');
    }
  }, {
    key: 'descrInput',
    get: function get() {
      return this.form.querySelector('.js-upload-description');
    }
  }]);

  return ImageLoader;
}();

var dropArea = new ImageLoader(document.querySelector('.js-drop-area'));
dropArea.init();
/****************************************/

/****************************************/
/****************FEED********************/

/****************************************/

var Feed = function () {
  function Feed() {
    _classCallCheck(this, Feed);
  }

  _createClass(Feed, null, [{
    key: 'createStat',


    //Методы для создания карточки-миниатюры
    value: function createStat(className, stat) {
      var td = document.createElement('td');

      var p = document.createElement('p');
      p.classList.add('stat');
      td.appendChild(p);

      var icon = document.createElement('span');
      icon.classList.add(className);
      p.appendChild(icon);

      var title = document.createElement('span');
      title.textContent = stat;
      p.appendChild(title);

      return td;
    }
  }, {
    key: 'createCard',
    value: function createCard(card) {
      var likes = card.likes ? Object.keys(card.likes).length : 0;
      var comments = card.comments ? Object.keys(card.comments).length : 0;
      var seen = card.seen ? Object.keys(card.seen).length : 0;
      var art = card.art ? Object.keys(card.art).length : 0;

      var container = document.createElement('div');
      container.classList.add('card-thumbnail');
      container.dataset.id = card.id;

      var overlay = document.createElement('div');
      overlay.classList.add('card-thumbnail__overlay');
      container.appendChild(overlay);

      var stats = document.createElement('div');
      stats.classList.add('card-thumbnail__stats', 'stats');
      container.appendChild(stats);

      var table = document.createElement('table');
      stats.appendChild(table);

      var row = document.createElement('tr');
      row.appendChild(Feed.createStat('icon-heart', likes));
      row.appendChild(Feed.createStat('icon-bubble', comments));
      table.appendChild(row.cloneNode(true));

      row.textContent = '';
      row.appendChild(Feed.createStat('icon-eye', seen));
      row.appendChild(Feed.createStat('icon-pencil', art));
      table.appendChild(row);

      var img = document.createElement('img');
      img.src = card.url;
      container.appendChild(img);

      return container;
    }
  }, {
    key: 'renderFeed',
    value: function renderFeed(feed) {
      var counter = 0;
      var fragment = document.createDocumentFragment();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = feed[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var card = _step2.value;

          if (counter === 0) {
            var newRow = document.createElement('div');
            newRow.classList.add('row');
            fragment.appendChild(newRow);
          }
          var curr = fragment.lastElementChild;

          var col = document.createElement('div');
          col.classList.add('col-sm-4');
          curr.appendChild(col);
          col.appendChild(Feed.createCard(card));

          ++counter === 3 ? counter = 0 : '';
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      Feed.feed.textContent = '';
      Feed.feed.appendChild(fragment);
    }
  }, {
    key: 'updFeed',
    value: function updFeed() {
      preloader.open();
      connection.getFeed().then(function (res) {
        return res.json();
      }).then(function (feed) {
        return Feed.renderFeed(feed);
      }).then(function () {
        return preloader.close();
      });
    }
  }, {
    key: 'feed',
    get: function get() {
      return document.querySelector('.js-feed');
    }
  }]);

  return Feed;
}();

Feed.updFeed();

/****************************************/

/****************************************/
/***********Творческий режим*************/

/****************************************/

var Art = function () {
  function Art(controls, parentModal) {
    var _this10 = this;

    _classCallCheck(this, Art);

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
    this.socket.addEventListener('close', function () {
      _this10.socket = null;
    });
    this.socket.addEventListener('error', function () {
      _this10.socket = null;
    });

    this.artIsActive = true;
    this.eventListeners = [];

    this.init();
  }

  _createClass(Art, [{
    key: 'repaint',
    value: function repaint() {
      //Функция перерисовки всей канвы
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.curves[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var curve = _step3.value;

          this.circle(curve[0]);
          this.smoothCurve(curve);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'circle',
    value: function circle(point) {
      //Функция рисует и заливает точку по переданным координатам
      this.ctx.beginPath();
      this.ctx.arc(point[0], point[1], point[3] / 2, 0, 2 * Math.PI);
      this.ctx.save();
      this.ctx.fillStyle = point[2];
      this.ctx.lineWidth = point[3];
      this.ctx.fill();
      this.ctx.restore();
    }
  }, {
    key: 'smoothCurveBetween',
    value: function smoothCurveBetween(p1, p2) {
      //Функция добавляет точку для квадратичной кривой Bezier
      var cpx = (p1[0] + p2[0]) / 2;
      var cpy = (p1[1] + p2[1]) / 2;
      this.ctx.quadraticCurveTo(p1[0], p1[1], cpx, cpy);
    }
  }, {
    key: 'smoothCurve',
    value: function smoothCurve(points) {
      this.ctx.beginPath();

      this.ctx.moveTo(points[0][0], points[0][1]);

      for (var i = 1; i < points.length - 1; i++) {
        this.smoothCurveBetween(points[i], points[i + 1]);
      }

      this.ctx.strokeStyle = points[points.length - 1][2];
      this.ctx.lineWidth = points[points.length - 1][3];
      this.ctx.stroke();
    }
  }, {
    key: 'tick',
    value: function tick() {
      var _this11 = this;

      this.shiftPressedControl();

      if (this.needsRepaint) {
        this.repaint();
        this.needsRepaint = false;
      }
      window.requestAnimationFrame(function () {
        if (_this11.artIsActive) _this11.tick();
      });
    }
  }, {
    key: 'shiftPressedControl',
    value: function shiftPressedControl() {
      var _this12 = this;

      //Следим за нажатием Shift, состояние храним в переменной shiftPressed
      document.addEventListener('keydown', function (e) {
        e.shiftKey ? _this12.shiftPressed = 1 : _this12.shiftPressed = 0;
      });
      document.addEventListener('keyup', function (e) {
        e.shiftKey ? _this12.shiftPressed = 1 : _this12.shiftPressed = 0;
      });
    }
  }, {
    key: 'checkBoundaries',
    value: function checkBoundaries(target) {
      if (target !== this.canvas) return 0;
      return 1;
    }
  }, {
    key: 'createMask',
    value: function createMask(maskLink) {
      var img = new Image();
      var urlCreator = window.URL || window.webkitURL;
      img.src = maskLink;
      img.crossOrigin = "Anonymous";
      img.classList.add('js-mask');
      img.style.width = this.canvas.width + 'px';
      img.style.height = this.canvas.height + 'px';

      return img;
    }
  }, {
    key: 'updMask',
    value: function updMask(maskLink) {
      var maskImg = this.createMask(maskLink);
      var oldMaskImg = this.imgContainer.querySelector('.js-mask');

      //если есть старая маска, то ее надо удалить
      if (oldMaskImg) oldMaskImg.remove();

      this.imgContainer.insertBefore(maskImg, this.canvas);
    }
  }, {
    key: 'sendMask',
    value: function sendMask(mask) {
      var _this13 = this;

      mask.toBlob(function (blob) {
        if (_this13.socket) _this13.socket.send(blob);
      });
    }
  }, {
    key: 'createMaskLink',
    value: function createMaskLink(link) {
      return link.substr(0, link.indexOf('nocache') - 1);
    }
  }, {
    key: 'stopArt',
    value: function stopArt() {
      //здесь надо написать выключение арт-режима
      if (this.socket) this.socket.close();
      delete this.socket;
      this.artIsActive = false;

      //отписка от использующих сокет событий событий
      if (this.eventListeners.length) {
        this.eventListeners.forEach(function (event) {
          event.object.removeEventListener(event.type, event.listener);
        });
      }
    }
  }, {
    key: 'mergeCanvasWithMask',
    value: function mergeCanvasWithMask(mask) {
      var mergedCanvas = this.canvas.cloneNode(false);
      var ctx = mergedCanvas.getContext('2d');
      ctx.drawImage(mask, 0, 0);
      return mergedCanvas;
    }
  }, {
    key: 'canvasUpdateHandler',
    value: function canvasUpdateHandler(canvas) {
      //отправить маску, если сокет готов
      if (this.socket && this.socket.readyState === 1) {
        var mask = this.imgContainer.querySelector('.js-mask');

        //Если маски нет, то отправляем один канвас, если есть - то сначала объединяем
        var maskToSend = mask ? this.mergeCanvasWithMask(mask) : canvas;

        this.sendMask(maskToSend);
      }
    }
  }, {
    key: 'socketMessageHandler',
    value: function socketMessageHandler(event) {
      var data = JSON.parse(event.data);
      if (data.event === 'mask') {
        var link = data.url;
        //Ссылка, приходящая в сокете, просто так почему-то не работает
        var maskLink = this.createMaskLink(link);
        this.updMask(maskLink);
      }
    }
  }, {
    key: 'init',
    value: function init() {
      var _this14 = this;

      this.imgContainer.appendChild(this.canvas);
      this.shiftPressedControl(); //запускаем слежение за shift


      window.addEventListener('resize', function () {
        _this14.ctx.lineJoin = 'round';
        _this14.ctx.lineCap = 'round';
        _this14.ctx.clearRect(0, 0, _this14.canvas.width, _this14.canvas.height);
      });

      this.canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        _this14.mouseHolded = true;
        var curve = [];
        curve.push([e.offsetX, e.offsetY, _this14.brushColor, _this14.brushWidth]);
        _this14.curves.push(curve);
        _this14.needsRepaint = true;
      });

      document.addEventListener('mouseup', function () {
        if (_this14.mouseHolded) {
          window.editor.emit('update', _this14.canvas);
          _this14.mouseHolded = false;
        }
      });

      this.canvas.addEventListener('mousemove', function (e) {
        e.preventDefault();
        if (!_this14.mouseHolded) return;
        _this14.curves[_this14.curves.length - 1].push([e.offsetX, e.offsetY, _this14.brushColor, _this14.brushWidth]);
        _this14.needsRepaint = true;
      });

      this.canvas.addEventListener('dblclick', function (e) {
        e.preventDefault();
        _this14.ctx.clearRect(0, 0, _this14.canvas.width, _this14.canvas.height);
        _this14.curves = [];
      });

      this.brushColorInput.addEventListener('change', function (e) {
        _this14.brushColor = e.target.value;
      });
      this.brushWidthInput.addEventListener('change', function (e) {
        _this14.brushWidth = e.target.value;
      });

      //Отправить маску по событию update на канвасе
      var bindedCanvasUpdateHandler = this.canvasUpdateHandler.bind(this);
      this.eventListeners.push({
        object: window.editor,
        type: 'update',
        listener: bindedCanvasUpdateHandler
      }); //нужно, чтоб при закрытии арт-режима отписаться от события
      window.editor.addEventListener('update', bindedCanvasUpdateHandler);

      //получить и подставить маску, если сокет ее присылает
      if (this.socket) {
        var bindedSocketMessageHandler = this.socketMessageHandler.bind(this);
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
  }]);

  return Art;
}();

/****************************************/

/****************************************/
/***********Модалка просмотрщик**********/

/****************************************/


var ShowPicModal = function (_Modal2) {
  _inherits(ShowPicModal, _Modal2);

  function ShowPicModal(modal) {
    _classCallCheck(this, ShowPicModal);

    var _this15 = _possibleConstructorReturn(this, (ShowPicModal.__proto__ || Object.getPrototypeOf(ShowPicModal)).call(this, modal));

    _this15.pic = modal.querySelector('.js-image-natural');
    _this15.likes = modal.querySelector('.js-image-like-counter');
    _this15.comments = modal.querySelector('.js-image-comment-counter');
    _this15.seen = modal.querySelector('.js-image-seen-counter');
    _this15.art = modal.querySelector('.js-art-counter');
    _this15.author = modal.querySelector('.js-image-author');
    _this15.postDate = modal.querySelector('.js-image-date');
    _this15.tags = modal.querySelector('.js-image-hashtags');
    _this15.commentsList = modal.querySelector('.image-comments');
    _this15.description = modal.querySelector('.js-image-description');

    _this15.commentForm = modal.querySelector('.js-comment-form');
    _this15.commentUID = modal.querySelector('.js-comment-uid');
    _this15.commentUID.value = localStorage.getItem('YellowGalleryUserName') || '';
    _this15.errorField = modal.querySelector('.js-comment-error');

    _this15.commentMessage = modal.querySelector('.js-comment-message');
    _this15.controlsInited = false;

    _this15.id = null; //будет хранить id картинки, когда модалка открыта.
    _this15.controlsInited = false; //хранит состояние initControls

    _this15.artObject = null; //При инициализации арт режима будет хранить экземпляр Art

    _this15.hasMask = false;
    return _this15;
  }

  _createClass(ShowPicModal, [{
    key: 'renderComment',
    value: function renderComment(author, body) {
      var container = document.createElement('div');
      container.classList.add('image-comment');

      var authorSpan = document.createElement('span');
      authorSpan.classList.add('image-comment-author');
      authorSpan.textContent = author + ': ';
      container.appendChild(authorSpan);

      var bodySpan = document.createElement('span');
      bodySpan.classList.add('image-comment-body');
      bodySpan.textContent = body;
      container.appendChild(bodySpan);

      return container;
    }
  }, {
    key: 'updateModalStatsComments',
    value: function updateModalStatsComments(id) {
      var _this16 = this;

      return connection.getCard(id).then(function (cardData) {
        //Статы
        _this16.likes.textContent = cardData.likes ? Object.keys(cardData.likes).length : 0;
        _this16.comments.textContent = cardData.comments ? Object.keys(cardData.comments).length : 0;
        _this16.seen.textContent = cardData.seen ? Object.keys(cardData.seen).length : 0;
        _this16.art.textContent = cardData.art ? Object.keys(cardData.art).length : 0;

        _this16.commentsList.textContent = '';
        for (var commentKey in cardData.comments) {
          _this16.commentsList.appendChild(_this16.renderComment(cardData.comments[commentKey].uid, cardData.comments[commentKey].message));
        }
      });
    }
  }, {
    key: 'updateModalData',
    value: function updateModalData(card) {
      var _this17 = this;

      return connection.getCard(card.dataset.id).then(function (cardData) {
        //Картинка
        _this17.pic.textContent = '';
        var img = document.createElement('img');
        img.src = cardData.url;
        _this17.pic.appendChild(img);
        return cardData;
      }).then(function (cardData) {
        //Статы
        _this17.likes.textContent = cardData.likes ? Object.keys(cardData.likes).length : 0;
        _this17.comments.textContent = cardData.comments ? Object.keys(cardData.comments).length : 0;
        _this17.seen.textContent = cardData.seen ? Object.keys(cardData.seen).length : 0;
        _this17.art.textContent = cardData.art ? Object.keys(cardData.art).length : 0;
        return cardData;
      }).then(function (cardData) {
        //Остальное
        _this17.author.textContent = cardData.uid;
        _this17.postDate.textContent = new Date(cardData.timestamp).toLocaleString();
        _this17.description.textContent = cardData.description;

        if (cardData.hasOwnProperty('mask')) {
          _this17.hasMask = true;
        }

        //Комменты
        for (var commentKey in cardData.comments) {
          _this17.commentsList.appendChild(_this17.renderComment(cardData.comments[commentKey].uid, cardData.comments[commentKey].message));
        }
      });
    }
  }, {
    key: 'showPic',
    value: function showPic(card) {
      var _this18 = this;

      preloader.open();
      this.id = card.dataset.id;
      connection.seeItem(this.id).then(function () {
        _this18.updateModalData(card).then(function () {
          if (!_this18.controlsInited) {
            _this18.initControls();
            _this18.controlsInited = true;
          }
        }).then(function () {
          _this18.open();
        }).then(function () {
          preloader.close();
        });
      });
    }
  }, {
    key: 'open',
    value: function open() {
      this.img = this.pic.querySelector('img');
      _get(ShowPicModal.prototype.__proto__ || Object.getPrototypeOf(ShowPicModal.prototype), 'open', this).call(this);
    }
  }, {
    key: 'close',
    value: function close() {
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
      _get(ShowPicModal.prototype.__proto__ || Object.getPrototypeOf(ShowPicModal.prototype), 'close', this).call(this);
    }
  }, {
    key: 'initControls',
    value: function initControls() {
      var _this19 = this;

      if (this.controlsInited) return;
      this.modal.querySelector('.js-image-like').addEventListener('click', function (e) {
        e.preventDefault();
        preloader.open();
        connection.likeItem(_this19.id).then(function () {
          _this19.updateModalStatsComments(_this19.id).then(function () {
            preloader.close();
          });
        });
      });

      this.commentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!_this19.commentUID.value || !_this19.commentMessage.value) {
          _this19.errorField.textContent = 'Не все поля заполнены';
          return;
        } else _this19.errorField.textContent = '';

        preloader.open();

        localStorage.setItem('YellowGalleryUserName', _this19.commentUID.value);

        connection.commentItem(_this19.id, _this19.commentUID.value, _this19.commentMessage.value).then(function () {
          _this19.updateModalStatsComments(_this19.id);
          _this19.commentMessage.value = '';
          preloader.close();
        });
      });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this20 = this;

      document.querySelector('.js-art-on').addEventListener('click', function (e) {
        var img = _this20.pic;
        var artTools = _this20.modal.querySelector('.image-art');
        _this20.artObject = new Art(artTools, _this20);
      });
      document.querySelector('.js-art-off').addEventListener('click', function (e) {
        _this20.pic.textContent = '';
        _this20.pic.appendChild(_this20.img);
        _this20.artObject.stopArt();
        _this20.artObject.active = false;
      });
      _get(ShowPicModal.prototype.__proto__ || Object.getPrototypeOf(ShowPicModal.prototype), 'init', this).call(this);
    }
  }]);

  return ShowPicModal;
}(Modal);

var showPicModal = new ShowPicModal(document.querySelector('.js-show-pic-modal'));
showPicModal.init();

//Ловим клик по миниатюре, используя делегирование событий
document.querySelector('.js-feed').addEventListener('click', function (e) {
  var path = e.path || e.composedPath && e.composedPath() || composedPath(e.target);
  var target = findTargetInPath('card-thumbnail', path);
  target ? showPicModal.showPic(target) : null;
});

/****************************************/