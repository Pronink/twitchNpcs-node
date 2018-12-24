const Color = require('cli-color');
const TwitchBot = require('twitch-bot');

const clavesTwitch = require('./../utilidades/utilidadesArchivos').obtenerClaves()['twitch'];
let conectadoConTwitch = false;
let prefijoRobot = clavesTwitch['prefijoRobot'];
let robotHabilitado = clavesTwitch['habilitarBot'];

console.log(Color.magenta('[TWITCH] Conectando con twitch...'));
const bot = new TwitchBot({
    username: clavesTwitch['username/channel'], // Nombre del usuario con el que se obtiene el token oauth
    oauth: clavesTwitch['oauth'], // Password oauth obtenido de http://twitchapps.com/tmi
    channels: [clavesTwitch['username/channel']] // Canal donde conectarse obtenida de la URL https://www.twitch.tv/*****
});

bot.on('join', () => {
    conectadoConTwitch = true;
    console.log(Color.magenta('[TWITCH] ') + Color.green('[Conectado]'));
});

bot.on('message', chatter => {
    console.log(Color.magenta('[TWITCH] [' + chatter.display_name + '] ') + chatter.message);
    conectorTwitch.onMensaje(chatter.display_name, chatter.username, chatter.message, chatter.mod, chatter.subscriber);
});

bot.on('error', err => {
    console.log(Color.magenta('[TWITCH] ') + Color.red('[ERROR] ' + JSON.stringify(err)));
});

let conectorTwitch = {
    onMensaje: (usuarioNombreFantasia, usuarioId, mensaje, esModerador, esSuscriptor) => {
    }/*,
    decir: (mensaje) => {
        if (robotHabilitado){
            if (conectadoConTwitch) {
                bot.say(prefijoRobot + ' ' + mensaje);
            } else {
                console.log(Color.red('[TWITCH] No se ha podido enviar el mensaje a twitch porque no hay una conexión establecida'))
            }
        }
    }*/
};

module.exports = conectorTwitch;