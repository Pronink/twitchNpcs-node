const fs = require('fs');
const Color = require('cli-color');
module.exports = {
    obtenerClaves: () => {
        let objeto = {};
        try{
            objeto = JSON.parse(fs.readFileSync('claves.json', 'utf8'));
        }catch (err) {
            console.log(Color.red('[OTROS] [ERROR] Error al leer el fichero claves.json ' + JSON.stringify(err)));
        }
        return objeto;
    }
};