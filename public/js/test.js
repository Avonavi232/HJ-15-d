'use strict';

function wrt(d) {
  console.log(d);
}

var wssUrl = 'wss://neto-api.herokuapp.com/yellowgallery/68dad5c0-ff2e-11e7-89e2-afe5096586a4';

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

canvas.height = canvas.width = 500;

ctx.beginPath();
ctx.arc(100, 75, 50, 0, 2 * Math.PI);
ctx.stroke();

var socket = new WebSocket(wssUrl);

socket.onopen = function () {
  wrt("Соединение установлено.");
};

socket.onmessage = function (event) {
  wrt("Получены данные");
  var data = JSON.parse(event.data);
  wrt(data);
  if (data.event === 'mask') {
    wrt("Картинка обновлена");
    var str = data.url.substr(0, data.url.indexOf('nocache') - 1);
    document.querySelector('.test-image').src = str;
  }
};

socket.onclose = function (event) {
  if (event.wasClean) {
    wrt('Соединение закрыто чисто');
  } else {
    wrt('Обрыв соединения');
  }
  wrt('Код: ' + event.code + ' причина: ' + event.reason);
};

document.querySelector('.test-button').addEventListener('click', function () {
  wrt('socket:status: ' + socket.readyState);
  canvas.toBlob(function (blob) {
    wrt("Отправляем");
    wrt(blob);
    socket.send(blob);
  });
});