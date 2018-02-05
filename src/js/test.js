'use strict';

function wrt(d) {
  console.log(d);
}

const wssUrl = 'wss://neto-api.herokuapp.com/yellowgallery/1f5fb470-ff28-11e7-9f10-19bd8572c366';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.height = canvas.width = 500;

ctx.beginPath();
ctx.arc(100,75,50,0,2*Math.PI);
ctx.stroke();

const socket = new WebSocket(wssUrl);

socket.onopen = function() {
  wrt("Соединение установлено.");

  socket.send('hello');
};

socket.onclose = function(event) {
  if (event.wasClean) {
    wrt('Соединение закрыто чисто');
  } else {
    wrt('Обрыв соединения');
  }
  wrt('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onmessage = function(event) {
  wrt("Получены данные");
  wrt(event);
};








