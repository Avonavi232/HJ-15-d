"use strict";var _get=function e(t,n,o){null===t&&(t=Function.prototype);var i=Object.getOwnPropertyDescriptor(t,n);if(void 0===i){var r=Object.getPrototypeOf(t);return null===r?void 0:e(r,n,o)}if("value"in i)return i.value;var a=i.get;return void 0!==a?a.call(o):void 0},_createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function wrt(e){console.log(e)}function throttle(e,t,n){var o,i;return t||(t=250),function(){var r=n||this,a=+new Date,s=arguments;o&&a<o+t?(clearTimeout(i),i=setTimeout(function(){o=a,e.apply(r,s)},t)):(o=a,e.apply(r,s))}}window.editor={events:{},addEventListener:function(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)},emit:function(e,t){var n=this;this.events[e]&&this.events[e].forEach(function(e){return e.call(n,t)})}};var Modal=function(){function e(t){_classCallCheck(this,e),this.modal=t,this.docBody=document.querySelector("body")}return _createClass(e,[{key:"closeAnimEnd",value:function(){this.modal.classList.contains("fadeIn")?(this.modal.classList.remove("fadeIn"),this.docBody.classList.add("modal-opened")):this.modal.classList.contains("fadeOut")&&(this.modal.style.display="none",this.modal.classList.remove("fadeOut"),this.docBody.classList.remove("modal-opened"))}},{key:"open",value:function(){this.modal.style.display="flex",this.modal.classList.remove("fadeOut"),this.modal.classList.add("fadeIn")}},{key:"close",value:function(){this.modal.classList.remove("fadeIn"),this.modal.classList.add("fadeOut")}},{key:"init",value:function(){var e=this;this.modal.querySelector(".js-modal-close").addEventListener("click",function(){e.close()}),this.modal.addEventListener("webkitAnimationEnd",function(){e.closeAnimEnd()}),this.modal.addEventListener("animationend",function(){e.closeAnimEnd()}),window.addEventListener("click",function(t){t.target===e.modal&&e.close()})}}]),e}(),Preloader=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,document.createElement("div")));e.modal.classList.add("preloader","modal");var n=new Image;return n.src="../../res/preloader.gif",e.modal.appendChild(n),document.querySelector("body").appendChild(e.modal),e.init(),e}return _inherits(t,Modal),_createClass(t,[{key:"init",value:function(){var e=this;this.modal.addEventListener("webkitAnimationEnd",function(){e.closeAnimEnd()}),this.modal.addEventListener("animationend",function(){e.closeAnimEnd()})}}]),t}(),preloader=new Preloader,Server=function(){function e(){_classCallCheck(this,e),this.art=null,this.baseurl="https://neto-api.herokuapp.com/yellowgallery/",this.oldurl="./src/js/feed.json",this.wssBaseUrl="wss://neto-api.herokuapp.com/yellowgallery/"}return _createClass(e,[{key:"getFeed",value:function(){return fetch(this.baseurl,{method:"GET"})}},{key:"getCard",value:function(e){return fetch(this.baseurl+e,{method:"GET"}).then(function(e){return e.json()})}},{key:"updArtState",value:function(e,t){this.art=null===e?null:{status:!0,id:t}}},{key:"uploadItem",value:function(e){fetch(this.baseurl,{method:"POST",body:e}).then(function(e){return e.json()}).then(function(e){wrt(e)})}},{key:"likeItem",value:function(e){if(e){var t=Math.floor(10*Math.random());return fetch(this.baseurl+e+"/likes/"+t,{method:"PUT"}).then(function(e){return e.json()})}}},{key:"commentItem",value:function(e,t,n){if(e)return fetch(this.baseurl+e+"/comments",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"uid="+encodeURIComponent(t)+"&message="+encodeURIComponent(n)}).then(function(e){return e.json()})}},{key:"seeItem",value:function(e){if(e)return fetch(this.baseurl+e+"/seen/"+Date.now(),{method:"PUT"}).then(function(e){return e.json()})}},{key:"artInit",value:function(e){var t=new WebSocket(this.wssBaseUrl+e);return t.onopen=function(){wrt("Соединение установлено.")},t.onclose=function(e){e.wasClean?wrt("Соединение закрыто чисто"):wrt("Обрыв соединения"),wrt("Код: "+e.code+" причина: "+e.reason)},t.onmessage=function(e){},t.onerror=function(e){wrt("Ошибка "+e.message)},t}},{key:"getMask",value:function(e){if(e)return fetch(this.baseurl+e+"/mask/"+Date.now(),{method:"GET"}).then(function(e){return e.blob()})}},{key:"sendCanvas",value:function(e,t){var n=this;return new Promise(function(o,i){e.toBlob(function(e){var i=new FormData;i.append("image",e),fetch(n.baseurl+t+"/mask ",{method:"PUT",body:i}).then(function(e){o(e.json())})})})}}]),e}(),connection=new Server,ImageSidebar=function(){function e(t){_classCallCheck(this,e),this.sidebar=document.querySelector("."+t.sidebar),this.art=document.querySelector("."+t.art),this.descr=document.querySelector("."+t.descr),this.state=!0}return _createClass(e,[{key:"toggle",value:function(){this.state?(this.descr.style.transform="translateX(600px)",this.art.style.transform="translateX(0px)",this.state=!1):(this.descr.style.transform="translateX(0px)",this.art.style.transform="translateX(-600px)",this.state=!0)}}]),e}(),imageSidebar=new ImageSidebar({sidebar:"image-sidebar",art:"image-art",descr:"image-infoblock"}),_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _step,_iterator=document.querySelectorAll(".js-image-sidebar-toggle")[Symbol.iterator]();!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){var btn=_step.value;btn.addEventListener("click",function(){imageSidebar.toggle()})}}catch(e){_didIteratorError=!0,_iteratorError=e}finally{try{!_iteratorNormalCompletion&&_iterator.return&&_iterator.return()}finally{if(_didIteratorError)throw _iteratorError}}var ImageLoader=function(){function e(t){_classCallCheck(this,e),this.dropArea=t,this.dropAreaInner=this.dropArea.firstElementChild,this.inputReplacer=document.querySelector(".js-upload-input-replacer"),this.input=document.querySelector(".js-upload-input"),this.preview=document.querySelector(".js-upload-image-preview"),this.form=document.querySelector(".js-upload-form"),this.imgToUpload=null,this.modalOpenBtn=document.querySelector(".js-upload-pic-btn"),this.modalUploadCancelBtn=document.querySelector(".js-upload-cancel"),this.modalUploadSubmitBtn=document.querySelector(".js-upload-form-submit"),this.modal=new Modal(document.querySelector(".js-upload-modal")),this.modal.init()}return _createClass(e,[{key:"getPreviewImg",value:function(e){if(e.length&&-1!==e[0].type.indexOf("image"))return URL.createObjectURL(e[0])}},{key:"showPreviewImg",value:function(e){var t=document.createElement("img");t.src=e,t.addEventListener("load",function(e){URL.revokeObjectURL(e.target.src)}),this.removePreviewImg(),this.preview.appendChild(t)}},{key:"removePreviewImg",value:function(){this.preview.textContent=""}},{key:"showPreviewInfo",value:function(){var e=document.createElement("div");e.classList.add("upload-infoblock");var t=document.createElement("div");t.classList.add("justified"),e.appendChild(t);var n=document.createElement("label");n.setAttribute("for","label-upload-uid"),n.textContent="Опубликовать от имени автора:",t.appendChild(n);var o=document.createElement("input");o.id="label-upload-uid",o.classList.add("js-upload-uid"),t.appendChild(o);var i=document.createElement("div");i.classList.add("justified"),e.appendChild(i);var r=document.createElement("label");r.setAttribute("for","label-upload-description"),r.textContent="Описание изображения:",i.appendChild(r);var a=document.createElement("textarea");a.id="label-upload-description",a.classList.add("js-upload-description"),i.appendChild(a),this.preview.appendChild(e)}},{key:"uploadCancel",value:function(){this.modal.close(),this.removePreviewImg()}},{key:"upload",value:function(e){if(this.imgToUpload)if(this.uidInput.value)if(-1!==this.imgToUpload.type.indexOf("png")){var t=new FormData(e);t.append("uid",this.form.querySelector(".js-upload-uid").value),t.append("description",this.form.querySelector(".js-upload-description").value),t.append("image",this.imgToUpload),connection.uploadItem(t)}else alert("You can only upload an PNG image");else alert("Enter the UID!");else alert("Attach an image!")}},{key:"init",value:function(){var e=this;this.input.addEventListener("change",function(t){t.preventDefault(),e.imgToUpload=t.target.files[0];var n=e.getPreviewImg(t.currentTarget.files);e.showPreviewImg(n),e.showPreviewInfo()}),this.dropArea.addEventListener("drop",function(t){t.preventDefault();var n=e.getPreviewImg(t.dataTransfer.files);e.imgToUpload=t.dataTransfer.files[0],e.showPreviewImg(n),e.showPreviewInfo(),e.dropArea.classList.remove("upload-modal__drop-area_dragover")}),this.dropArea.addEventListener("dragover",function(t){t.preventDefault(),t.target!==e.dropArea&&t.target!==e.dropAreaInner||e.dropArea.classList.add("upload-modal__drop-area_dragover")}),this.inputReplacer.addEventListener("click",function(){e.input.click()}),this.modalOpenBtn.addEventListener("click",function(t){e.modal.open()}),this.modalUploadCancelBtn.addEventListener("click",function(t){e.uploadCancel()}),this.form.addEventListener("submit",function(t){t.preventDefault(),e.upload(t)})}},{key:"uidInput",get:function(){return this.form.querySelector(".js-upload-uid")}},{key:"descrInput",get:function(){return this.form.querySelector(".js-upload-description")}}]),e}(),dropArea=new ImageLoader(document.querySelector(".js-drop-area"));dropArea.init();var Feed=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"createStat",value:function(e,t){var n=document.createElement("td"),o=document.createElement("p");o.classList.add("stat"),n.appendChild(o);var i=document.createElement("span");i.classList.add(e),o.appendChild(i);var r=document.createElement("span");return r.textContent=t,o.appendChild(r),n}},{key:"createCard",value:function(t){var n=t.likes?Object.keys(t.likes).length:0,o=t.comments?Object.keys(t.comments).length:0,i=t.seen?Object.keys(t.seen).length:0,r=t.art?Object.keys(t.art).length:0,a=document.createElement("div");a.classList.add("card-thumbnail"),a.dataset.id=t.id;var s=document.createElement("div");s.classList.add("card-thumbnail__overlay"),a.appendChild(s);var c=document.createElement("div");c.classList.add("card-thumbnail__stats","stats"),a.appendChild(c);var l=document.createElement("table");c.appendChild(l);var d=document.createElement("tr");d.appendChild(e.createStat("icon-heart",n)),d.appendChild(e.createStat("icon-bubble",o)),l.appendChild(d.cloneNode(!0)),d.textContent="",d.appendChild(e.createStat("icon-eye",i)),d.appendChild(e.createStat("icon-pencil",r)),l.appendChild(d);var u=document.createElement("img");return u.src=t.url,a.appendChild(u),a}},{key:"renderFeed",value:function(t){var n=0,o=document.createDocumentFragment(),i=!0,r=!1,a=void 0;try{for(var s,c=t[Symbol.iterator]();!(i=(s=c.next()).done);i=!0){var l=s.value;if(0===n){var d=document.createElement("div");d.classList.add("row"),o.appendChild(d)}var u=o.lastElementChild,h=document.createElement("div");h.classList.add("col-sm-4"),u.appendChild(h),h.appendChild(e.createCard(l)),3==++n&&(n=0)}}catch(e){r=!0,a=e}finally{try{!i&&c.return&&c.return()}finally{if(r)throw a}}e.feed.textContent="",e.feed.appendChild(o)}},{key:"updFeed",value:function(){preloader.open(),connection.getFeed().then(function(e){return e.json()}).then(function(t){return e.renderFeed(t)}).then(function(){return preloader.close()})}},{key:"feed",get:function(){return document.querySelector(".js-feed")}}]),e}();Feed.updFeed();var Art=function(){function e(t,n,o){var i=this;_classCallCheck(this,e),this.imgContainer=t,this.img=t.querySelector("img"),this.id=o,this.canvas=document.createElement("canvas"),this.canvas.height=this.img.clientHeight,this.canvas.width=this.img.clientWidth,this.ctx=this.canvas.getContext("2d"),this.brushColorInput=n.querySelector(".art-controls-color"),this.brushWidthInput=n.querySelector(".art-controls-size"),this.brushColor=this.brushColorInput.value,this.brushWidth=this.brushWidthInput.value,this.ctx.lineJoin="round",this.ctx.lineCap="round",this.shiftPressed=0,this.needsRepaint=!1,this.curves=[],this.mouseHolded=0,this.socket=connection.artInit(this.id),this.socket.addEventListener("open",function(){i.init()})}return _createClass(e,[{key:"repaint",value:function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);var e=!0,t=!1,n=void 0;try{for(var o,i=this.curves[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var r=o.value;this.circle(r[0]),this.smoothCurve(r)}}catch(e){t=!0,n=e}finally{try{!e&&i.return&&i.return()}finally{if(t)throw n}}}},{key:"circle",value:function(e){this.ctx.beginPath(),this.ctx.arc(e[0],e[1],e[3]/2,0,2*Math.PI),this.ctx.save(),this.ctx.fillStyle=e[2],this.ctx.lineWidth=e[3],this.ctx.fill(),this.ctx.restore()}},{key:"smoothCurveBetween",value:function(e,t){var n=(e[0]+t[0])/2,o=(e[1]+t[1])/2;this.ctx.quadraticCurveTo(e[0],e[1],n,o)}},{key:"smoothCurve",value:function(e){this.ctx.beginPath(),this.ctx.moveTo(e[0][0],e[0][1]);for(var t=1;t<e.length-1;t++)this.smoothCurveBetween(e[t],e[t+1]);this.ctx.strokeStyle=e[e.length-1][2],this.ctx.lineWidth=e[e.length-1][3],this.ctx.stroke()}},{key:"tick",value:function(){var e=this;this.shiftPressedControl(),this.needsRepaint&&(this.repaint(),this.needsRepaint=!1),window.requestAnimationFrame(function(){e.tick()})}},{key:"shiftPressedControl",value:function(){var e=this;document.addEventListener("keydown",function(t){t.shiftKey?e.shiftPressed=1:e.shiftPressed=0}),document.addEventListener("keyup",function(t){t.shiftKey?e.shiftPressed=1:e.shiftPressed=0})}},{key:"checkBoundaries",value:function(e){return e!==this.canvas?0:1}},{key:"setMask",value:function(){var e=this;return connection.getMask(this.id).then(function(t){var n=new Image,o=window.URL||window.webkitURL;n.src=o.createObjectURL(t),n.crossOrigin="Anonymous",n.classList.add("js-mask"),n.style.width=e.canvas.width+"px",n.style.height=e.canvas.height+"px",n.onload=function(){var t=e.imgContainer.querySelector(".js-mask");t&&t.remove(),e.imgContainer.insertBefore(n,e.canvas),preloader.close()}})}},{key:"init",value:function(){var e=this;this.imgContainer.appendChild(this.canvas),this.shiftPressedControl(),preloader.open(),window.addEventListener("resize",function(){e.ctx.lineJoin="round",e.ctx.lineCap="round",e.ctx.clearRect(0,0,e.canvas.width,e.canvas.height)}),this.canvas.addEventListener("mousedown",function(t){t.preventDefault(),e.mouseHolded=1;var n=[];n.push([t.offsetX,t.offsetY,e.brushColor,e.brushWidth]),e.curves.push(n),e.needsRepaint=!0}),document.addEventListener("mouseup",function(){e.mouseHolded=0,window.editor.emit("update",e.canvas)}),this.canvas.addEventListener("mousemove",function(t){t.preventDefault(),e.mouseHolded&&(e.curves[e.curves.length-1].push([t.offsetX,t.offsetY,e.brushColor,e.brushWidth]),e.needsRepaint=!0)}),this.canvas.addEventListener("dblclick",function(t){t.preventDefault(),e.ctx.clearRect(0,0,e.canvas.width,e.canvas.height),e.curves=[]}),this.brushColorInput.addEventListener("change",function(t){e.brushColor=t.target.value}),this.brushWidthInput.addEventListener("change",function(t){e.brushWidth=t.target.value}),window.editor.addEventListener("update",throttle(function(t){var n=e.imgContainer.querySelector(".js-mask");if(n){var o=document.createElement("canvas");o.width=e.canvas.width,o.height=e.canvas.height;var i=o.getContext("2d");i.drawImage(n,0,0),i.drawImage(t,0,0),connection.sendCanvas(o,e.id).then(function(e){return wrt(e)})}else connection.sendCanvas(t,e.id).then(function(e){return wrt(e)})},3e3,this)),this.setMask().then(function(){preloader.close()}),setInterval(this.setMask.bind(this),3e3),this.tick()}}]),e}(),ShowPicModal=function(e){function t(e){_classCallCheck(this,t);var n=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.pic=e.querySelector(".js-image-natural"),n.likes=e.querySelector(".js-image-like-counter"),n.comments=e.querySelector(".js-image-comment-counter"),n.seen=e.querySelector(".js-image-seen-counter"),n.art=e.querySelector(".js-art-counter"),n.author=e.querySelector(".js-image-author"),n.postDate=e.querySelector(".js-image-date"),n.tags=e.querySelector(".js-image-hashtags"),n.commentsList=e.querySelector(".image-comments"),n.description=e.querySelector(".js-image-description"),n.commentForm=e.querySelector(".js-comment-form"),n.commentUID=e.querySelector(".js-comment-uid"),n.commentUID.value=localStorage.getItem("YellowGalleryUserName")||"",n.commentMessage=e.querySelector(".js-comment-message"),n.controlsInited=!1,n.id=null,n.controlsInited=!1,n}return _inherits(t,Modal),_createClass(t,[{key:"renderComment",value:function(e,t){var n=document.createElement("div");n.classList.add("image-comment");var o=document.createElement("span");o.classList.add("image-comment-author"),o.textContent=e+": ",n.appendChild(o);var i=document.createElement("span");return i.classList.add("image-comment-body"),i.textContent=t,n.appendChild(i),n}},{key:"updateModalStatsComments",value:function(e){var t=this;return connection.getCard(e).then(function(e){t.likes.textContent=e.likes?Object.keys(e.likes).length:0,t.comments.textContent=e.comments?Object.keys(e.comments).length:0,t.seen.textContent=e.seen?Object.keys(e.seen).length:0,t.art.textContent=e.art?Object.keys(e.art).length:0,t.commentsList.textContent="";for(var n in e.comments)t.commentsList.appendChild(t.renderComment(e.comments[n].uid,e.comments[n].message))})}},{key:"updateModalData",value:function(e){var t=this;return connection.getCard(e.dataset.id).then(function(e){t.pic.textContent="";var n=document.createElement("img");return n.src=e.url,t.pic.appendChild(n),e}).then(function(e){return t.likes.textContent=e.likes?Object.keys(e.likes).length:0,t.comments.textContent=e.comments?Object.keys(e.comments).length:0,t.seen.textContent=e.seen?Object.keys(e.seen).length:0,t.art.textContent=e.art?Object.keys(e.art).length:0,e}).then(function(e){t.author.textContent=e.uid,t.postDate.textContent=new Date(e.timestamp).toLocaleString(),t.description.textContent=e.description;for(var n in e.comments)t.commentsList.appendChild(t.renderComment(e.comments[n].uid,e.comments[n].message))})}},{key:"showPic",value:function(e){var t=this;preloader.open(),this.id=e.dataset.id,connection.seeItem(this.id).then(function(){t.updateModalData(e).then(function(){t.controlsInited||(t.initControls(),t.controlsInited=!0)}).then(function(){t.open()}).then(function(){preloader.close()})})}},{key:"open",value:function(){this.img=this.pic.querySelector("img"),_get(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"open",this).call(this)}},{key:"close",value:function(){this.pic.textContent="",this.likes.textContent="",this.comments.textContent="",this.seen.textContent="",this.art.textContent="",this.author.textContent="",this.postDate.textContent="",this.tags.textContent="",this.commentsList.textContent="",this.description.textContent="",this.controlsInited=!1,_get(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"close",this).call(this)}},{key:"initControls",value:function(){var e=this;this.controlsInited||(this.modal.querySelector(".js-image-like").addEventListener("click",function(t){t.preventDefault(),preloader.open(),connection.likeItem(e.id).then(function(){e.updateModalStatsComments(e.id).then(function(){preloader.close()})})}),this.commentForm.addEventListener("submit",function(t){t.preventDefault(),e.commentUID&&e.commentMessage?(preloader.open(),localStorage.setItem("YellowGalleryUserName",e.commentUID.value),connection.commentItem(e.id,e.commentUID.value,e.commentMessage.value).then(function(){e.updateModalStatsComments(e.id),e.commentMessage.value="",preloader.close()})):alert("Не все поля заполнены")}))}},{key:"init",value:function(){var e=this;document.querySelector(".js-art-on").addEventListener("click",function(t){var n=e.pic,o=e.modal.querySelector(".image-art");new Art(n,o,e.id)}),document.querySelector(".js-art-off").addEventListener("click",function(t){e.pic.textContent="",e.pic.appendChild(e.img),connection.updArtState(null)}),_get(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"init",this).call(this)}}]),t}(),showPicModal=new ShowPicModal(document.querySelector(".js-show-pic-modal"));showPicModal.init(),document.querySelector(".js-feed").addEventListener("click",function(e){var t=!0,n=!1,o=void 0;try{for(var i,r=e.path[Symbol.iterator]();!(t=(i=r.next()).done);t=!0){var a=i.value;if(a.classList.contains("card-thumbnail")){showPicModal.showPic(a);break}if("BODY"===a.tagName)break}}catch(e){n=!0,o=e}finally{try{!t&&r.return&&r.return()}finally{if(n)throw o}}});