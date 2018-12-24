const Color = require('cli-color');
const YouTube = require('youtube-live-chat');

const clavesYoutube = require('./../utilidades/utilidadesArchivos').obtenerClaves()['youtube'];

const fechaHoraActual = new Date();
let errorChatNoEncontrado = false;

function conectarConYoutube(livestreamId) {
//                       ('YOUTUBE_LIVESTREAM_ID', 'APIKEY_IS_HERE')
    const yt = new YouTube(livestreamId, clavesYoutube['apiKey']);

    yt.on('ready', () => {
        console.log(Color.red('[YOUTUBE] ') + Color.green('[Conectado]'));
        //fetch messages every x sec
        yt.listen(clavesYoutube['milisegundosIntervalo']);
    });

    //called every time a new chat comes through
    //gets called many times when you first run it
    yt.on('chat', json => {
        if (new Date(json['snippet']['publishedAt']) > fechaHoraActual) {
            console.log(Color.red('[YOUTUBE] [' + json['authorDetails']['displayName'] + '] ') + json['snippet']['displayMessage']);
            conectorYoutube.onMensaje(json['authorDetails']['displayName'], json['authorDetails']['channelId'], json['snippet']['displayMessage'],
                json['authorDetails']['isChatModerator'], json['authorDetails']['isChatSponsor']);
        }
    });

    //catch errors
    yt.on('error', err => {
        if (!errorChatNoEncontrado) {
            console.log(Color.red('[YOUTUBE] [ERROR] ' + JSON.stringify(err)));
        }
        try {
            // Sucede cuando el livestreamId ha caducado (se terminó el directo)
            // y este if evita que sigan saliendo indefinidamente errores cada
            // intervalo de tiempo.
            if (err['error']['errors'][0]['reason'] === 'liveChatNotFound') {
                errorChatNoEncontrado = true;
            }
        } catch (e) {
        }
    });
}

// Puedo obtener el videoId del streaming a traves del channelId
function obtenerVideoId(callback){
    const nuevaSolicitudGet = require('../utilidades/utilidadesHttp').nuevaSolicitudGet;
    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' +
        clavesYoutube['channelId'] +
        '&eventType=live&type=video&key=' +
        clavesYoutube['apiKey'];
    nuevaSolicitudGet(url, (respuestaApiYoutube) => {
        try {
            let videoId = respuestaApiYoutube['items'][0]['id']['videoId'];
            conectarConYoutube(videoId); // Obtengo el videoId del streaming a traves del channelId
            callback(videoId);
        } catch (e) {
            console.log(Color.red('[YOUTUBE] [ERROR] ' + "No se pudo obtener el videoId del directo"));
        }
    });
}

console.log(Color.red('[YOUTUBE] Conectando con youtube...'));
// Obtiene el id del directo y luego conecta con su chat
obtenerVideoId(conectarConYoutube);

let conectorYoutube = {
    onMensaje: (usuarioNombreFantasia, usuarioId, mensaje, esModerador, esSuscriptor) => {
    }
};

module.exports = conectorYoutube;