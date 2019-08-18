const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const esquemaCliente = new mongoose.Schema({
    correo: String,
    nombre: String,
    contraseña: String
});

esquemaCliente.methods.encriptarContraseña = function(contraseña){
    this.contraseña = bcrypt.hashSync(contraseña, bcrypt.genSaltSync(10));
};

esquemaCliente.methods.validarContraseña = function(campoContraseña){
    return bcrypt.compareSync(campoContraseña, this.contraseña);
};

module.exports = mongoose.model('clientes', esquemaCliente);