const passport = require('passport');
const estrategiaLocal = require('passport-local').Strategy;
const Cliente = require('../modelos/cliente');

passport.serializeUser((cliente, callBack)=>{
    callBack(null, cliente._id);
});

passport.deserializeUser(async (_id, callBack)=>{
    const cliente = await Cliente.findById(_id);
    callBack(null, cliente);
});

passport.use('registrar-cliente', new estrategiaLocal({
    usernameField: 'correo',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async (req, correo, contraseña, callBack)=>{
    const consulta = await Cliente.findOne({correo: correo});
    if(consulta){
      return  callBack(null, false);
    }else{
        const cliente = new Cliente();
        cliente.contraseña = contraseña;
        cliente.correo = correo;
        cliente.nombre = req.body['nombre'];
        cliente.encriptarContraseña(contraseña);
        await cliente.save();
        callBack(null, cliente);
    }
}));

passport.use('iniciar-sesion', new estrategiaLocal({
    usernameField: 'correo',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async (req, correo, contraseña, callBack)=>{

    const cliente = await Cliente.findOne({correo: req.body['correo']});

    if(!cliente){
       return callBack(null, false);
    }else{
        if(!cliente.validarContraseña(req.body['contraseña'])){
            return callBack(null, false);
        }else{
            callBack(null, cliente);
        }
    }
}));