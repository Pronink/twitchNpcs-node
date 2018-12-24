const Color = require('cli-color');
module.exports = {
    ejecutarProcedimiento(conn, procedimientoNombre, parametros) {
        // Genera una llamada a un procedimiento almacenado
        // Ej: 'CALL nuevo_mensaje(?, ?, ?, ?, ?, ?, ?, ?, ?)'
        function crearQuery(procedimientoNombre, numeroDeParametros) {
            let llamada = 'CALL ' + procedimientoNombre + '(';
            while (numeroDeParametros > 0) {
                if (numeroDeParametros !== 1) {
                    llamada += '?, ';
                } else {
                    llamada += '?';
                }
                numeroDeParametros--;
            }
            return llamada + ')';
        }

        conn.query(crearQuery(procedimientoNombre, parametros.length), parametros)
            .then(res => {
                console.log(Color.blue('[DB] ' + JSON.stringify(res))); // Todo: Actualmente no devuelvo "res" en ningún callback
                conn.end();
            })
            .catch(err => {
                console.log(Color.blue('[DB] ') + Color.red('[ERROR] ' + JSON.stringify(err)));
                conn.end();
            });
    }
};