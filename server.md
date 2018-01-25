# Требования к серверной части

## Функционал
Приложение поддерживает следующий функционал (связанный с серверной частью):  
1. Загрузка, хранение, получение и модификация объектов изображений на сервере
2. Трансляция открытого творческого режима у пользователя  

Для обеспечения такого функционала сервер должен принимать/отправлять информацию по http и поддерживать websocket.

### Получение изображений
URL: `./fetch?id=` , `./fetch`
method: `GET`
Необходимо получать объекты изображений в двух форматах: сразу все, и по id. В случае получения сразу всех изображений необходимы только некоторые поля:
    
    {
        'id': //id изображения
        'src': //ссылка на картинку
    }
    
При получении конкретного изображения по его id - необходимо отдать объект изображения полностью со всеми полями


### Загрузка и хранение изображений

Для *загрузки* изображений предполагается отправлять POST запрос на url './upload', тело которого будет содержать js экземпляр объекта FormData, в котором будет содержаться:  

    {
        'img': img (blob),  
        'description': text,  
        'hashtags': text,
        'author': text
    }  
    
При этом, *хранение* такого объекта подразумевает наличие у него, дополнительно, полей, создающихся и поддерживающихся (см.модификация изображений) серверной частью:  

    {
        'likes': number,  
        'comments': number,
        'seen': number,
        'art': number,
        'commentsList': [
            {
                'author': text
                'body': text
            }, ...
        ],
        'timestamp': timestamp,
        'id': uniqueId
    }  
    
Поля необходимы для хранения статистики, списка комментариев, времени публикации и id каждого конкретного поста
Сервер должен ответить ошибкой или успехом

### Модификация изображений

Пользователь имеет возможность лайкнуть, оставить комментарий и войти в творческий режим. Так же, при открытии карточки изображения счетчик просмотров автоматически увеличивается.
По каждому из пунктов подразумевается отправлять POST запрос, изменяющий счетчик соответствующей статистики. В случае лайков, комментариев и просмотров - статистика может только увеличиться (идентификация лайкающего пользователя не предусмотрена, возможность удалить комментарий не предусмотрена, уменьшение просмотров не имеет физического смысла). Количество текущих активных пользователей, находящихся в творческом режиме (иначе говоря - текущий онлайн) может меняться в обе стороны.  
Отправляемый пакет предполагается быть в json формате и иметь вид:  

    {
        "id": number //id изменяемого изображения
        "[likes|comments|seen|art]": 0|1 //название изменяемого параметра: 0 для уменьшения, 1 для увеличения
        "commentBody": text //если это комментарий, то будет и эти два поля
        "commentAuthor": text
    }
    
URL запроса: `./update`
Сервер должен ответить ошибкой или успехом

### Трансляция творческого режима

Здесь пользователи смогут совместно разукрашивать фотографии. Изменения, сделанные в творческом режиме, не подразумевается сохранять в качестве основной фотографии.
Предполагается использование протокола websocket для обеспечения такого функционала.

Клиентская часть устанавливает соединение с сервером по адресу `wss...../art`. При изменении состояния canvas (иначе - при рисовании) клиент будет отправлять новое состояние в формате (blob ?). Принятое состояние канвы сервер сохраняет в качестве актуального, затирая предыдущее. Сервер раз в n времени отправляет актуальное состояние в том же формате. 