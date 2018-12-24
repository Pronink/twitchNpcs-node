const Color = require('cli-color');
const mariadb = require('mariadb');
const ejecutarProcedimiento = require('./../utilidades/utilidadesBaseDatos').ejecutarProcedimiento;
const clavesBaseDeDatos = require('./../utilidades/utilidadesArchivos').obtenerClaves()['baseDeDatos'];

// Crea la pool de la base de datos, para obtener conexiones
console.log(Color.blue('[DB] Conectando con la base de datos...'));
const pool = mariadb.createPool({
    host: clavesBaseDeDatos['ip'],
    user: clavesBaseDeDatos['usuario'],
    password: clavesBaseDeDatos['password'],
    database: clavesBaseDeDatos['nombreBaseDatos'],
    connectionLimit: 5
});

// Prueba la conexión a la base de datos
pool.getConnection()
    .then(conn => {
        console.log(Color.blue('[DB] ') + Color.green('[Conectado]'));
        conn.end();
    })
    .catch(err => {
        console.log(Color.blue('[DB] ') + Color.red('[ERROR] ' + JSON.stringify(err)));
        process.exit(1);
    });

// Exporta las funciones preparadas para llamar a la base de datos
module.exports = {
    nuevoMensaje: (usuarioNombreFantasia, usuarioId, plataformaId, esModerador, esSuscriptor, mensaje, coordenadaX, coordenadaY, coordenadaZ) => {
        pool.getConnection()
            .then(conn => {
                ejecutarProcedimiento(conn, 'nuevo_mensaje', [
                    usuarioId, plataformaId, usuarioNombreFantasia, esModerador, esSuscriptor, mensaje,
                    coordenadaX, coordenadaY, coordenadaZ]);
            })
            .catch(err => {
                console.log(Color.blue('[DB] ') + Color.red('[ERROR] ' + JSON.stringify(err)));
            });
    }
};
