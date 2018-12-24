const youtube = require('./conexiones/conectorYoutube');
const twitch = require('./conexiones/conectorTwitch');
const db = require('./conexiones/daoBaseDatos');
const Plataforma = require('./clases/plataforma');

function guardarMensaje(usuarioNombreFantasia, usuarioId, mensaje, esModerador, esSuscriptor, plataforma) {
    let mensajeTroceado = mensaje.split(' ').filter(palabra => palabra !== ''); // Troceo por espacios y elimino los strings vacios
    let numeroSinLetras = new RegExp(/^-?\d*\.?\d*$/); // Verificador de que el numero no tiene letras
    if (mensajeTroceado.length > 3 && // Verifica que tiene mensaje, a parte de las 3 coordenadas
        numeroSinLetras.test(mensajeTroceado[0].replace(',','.')) && //\
        numeroSinLetras.test(mensajeTroceado[1].replace(',','.')) && //| => Verifica que el numero no tiene letras
        numeroSinLetras.test(mensajeTroceado[2].replace(',','.'))    ///
    ) {
        let x = parseInt(mensajeTroceado[0]); //\
        let y = parseInt(mensajeTroceado[1]); //| => Quita los decimales
        let z = parseInt(mensajeTroceado[2]); ///
        let mensajeTexto = mensajeTroceado.slice(3).join(' '); // Retiro las coordenadas del mensaje
        if (y > 0 && y <= 256 && // Verifica que el eje y no sea menor o igual a cero ni mayor a 256
            Number.isSafeInteger(x) && //\
            Number.isSafeInteger(y) && //| => Verifica que no es NaN ni excede el tamaño de memoria
            Number.isSafeInteger(z) && ///
            mensajeTexto.length < 200 // El mensaje en la base de datos es VARCHAR(200)
        ) {
            db.nuevoMensaje(usuarioNombreFantasia, usuarioId, plataforma, esModerador, esSuscriptor, mensajeTexto, x, y, z); // Guardar el mensaje en la base de datos
            if (plataforma === Plataforma.twitch){
                twitch.decir('Hola ' + usuarioNombreFantasia + ' ! Tu comentario ha sido guardado y será mostrado dentro del mundo de Minecraft en breve!');
            }
        } else if (plataforma === Plataforma.twitch) {
            if (y <= 0 || y > 256) { // Errores
                twitch.decir('Hola ' + usuarioNombreFantasia + ' ! No puedes introducir un número menor o igual a 0 ni mayor a 256 en el eje Y de Minecraft. Inténtelo de nuevo!');
            } else if (mensajeTexto.length >= 200) {
                twitch.decir('Hola ' + usuarioNombreFantasia + ' ! No puedes introducir un mensaje de más de 200 caracteres. Inténtelo de nuevo!');
            } else if (
                !Number.isSafeInteger(x) || //\
                !Number.isSafeInteger(y) || //| => Verifica que no es NaN ni excede el tamaño de memoria
                !Number.isSafeInteger(z))   ///
            {
                twitch.decir('Hola ' + usuarioNombreFantasia + ' ! No puedes introducir números tan grandes para las coordenadas. Inténtelo de nuevo!');
            } else {
                twitch.decir('Hola ' + usuarioNombreFantasia + ' ! Ha ocurrido un error al tratar tu mensaje. Inténtelo de nuevo!');
            }
        }
    }
}

twitch.onMensaje = (usuarioNombreFantasia, usuarioId, mensaje, esModerador, esSuscriptor) => {
    guardarMensaje(usuarioNombreFantasia, usuarioId, mensaje, esModerador, esSuscriptor, Plataforma.twitch);
};

youtube.onMensaje = (usuarioNombreFantasia, usuarioId, mensaje, esModerador, esSuscriptor) => {
    guardarMensaje(usuarioNombreFantasia, usuarioId, mensaje, esModerador, esSuscriptor, Plataforma.youtube);
};


