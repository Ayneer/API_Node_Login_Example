const passport = require('passport');
const estrategiaLocal = require('passport-local').Strategy;
const Cliente = require('../modelos/cliente');

/*
Metodo que usa passport para guardar una cookie de un usuario
al momento de iniciar sesion.
*/

passport.serializeUser((cliente, callBack)=>{
    callBack(null, cliente._id);
});

/*
Metodo que usa passport para acceder a un usuario
al momento de requerirlo por medio de la cookie.
*/

passport.deserializeUser(async (_id, callBack)=>{
    const cliente = await Cliente.findById(_id);
    callBack(null, cliente);
});

/*
Estrategias para capturar y validar los datos de sesiones.
De esta forma, se puede especificar varias validaciones de 
sesiones, por ejemplo, una que se hace al momento de registrar
y otra que se hace al momento de iniciar sesion.
Estas se usan mas que todo a login/registro que redireccionan
al aplicativo una vez realicen su acción.

*/

passport.use('registrar-cliente', new estrategiaLocal({

    /* Estas son variables que crea passport por defecto y
    que se debe de usar siempre. Debido a que passport esta
    diseñado para trabajar con sesiones, lo comun es tener
    un usuario y contraseña, las cuales la obetendra passport 
    de la peticion realizada por el navegador. */
    usernameField: 'correo',
    passwordField: 'contraseña',
    passReqToCallback: true /* Esta linea es para inidicarle a passport que trabajare con el request del navegador. */

}, async (req, correo, contraseña, callBack)=>{

    //Se verifica la existencia del correo enviado.
    const consulta = await Cliente.findOne({correo: correo});

    //De existir el correo, no se podra realizar el registro.
    if(consulta){
      return  callBack(null, false);
    }else{
        //De no existir el correo, se terminan de llenar los campos y se crea el usuario.
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
    /* En este caso no se esta haciendo uso del correo ni de la contraseña directamente capturada por el passport, a lo que se
    se usa la contenida en el request, que es lo mismo.
    De igual forma se puede usar la capturada por passport, no
    hay ningun error o impedimento. */

    /*Se consulta la existencia en la base de datos del correo del
    cliente que intenta iniciar sesion. */
    const cliente = await Cliente.findOne({correo: req.body['correo']});

    /*De no existir el correo, no podrá iniciar sesion. */
    if(!cliente){
       return callBack(null, false);
    }else{
        /*De existir el correo, se verifica la contraseña con la
        almacenada.  
        Si no coincide la contraseña, no podra iniciar sesion el cliente.
        */
        if(!cliente.validarContraseña(req.body['contraseña'])){
            return callBack(null, false);
        }else{
            /*Si existe la contraseña, se devuelve el cliente para que 
            se cree la cookie de sesion. */
            callBack(null, cliente);
        }
    }
}));

/*
Estrategia para capturar y validar los datos de sesiones.
De esta forma, se realiza una validacion de forma general
solo para el login y se accederá por el metodo passport.authenticate('local'), debido a que tendra ese nombre por defecto, pero tambien
se puede definir un nombre propio como a los anteriores.

*/

passport.use(new estrategiaLocal({
    usernameField: 'correo',
    passwordField: 'contraseña'
}, async (correo, contraseña, callBack)=>{
    const cliente = await Cliente.findOne({correo: correo});

    if(!cliente){
       return callBack(null, false);
    }else{
        if(!cliente.validarContraseña(contraseña)){
            return callBack(null, false);
        }else{
            callBack(null, true, cliente);
        }
    }
}));