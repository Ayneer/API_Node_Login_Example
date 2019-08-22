const express = require('express');
const rutas = express.Router();
const passport = require('passport');

rutas.get('/', (req, res)=>{
    /* El metodo req.isAuthenticated() lo crea por defecto
    passport para verificar si esta o no autenticado
    el navegador que esta haciedo la peticion. */
    if(req.isAuthenticated()){
        res.redirect('/app');
    }else{
        res.send("Tienes que iniciar sesion");
    }
});

rutas.get('/app', (req, res, next)=>{
    if(req.isAuthenticated()){
        /* La variable req.user la crea passport para obtener
        toda la informacion referente al objeto de la sesion 
        que este activa. */
        res.send(req.user);
    }else{
        res.redirect('/');
    }
});

/* Al usar de esta forma una estrategia de passport,
no hay necesidad de llamar al metodo req.logIn() que crea
por defecto passport, porque de esta forma se llama automaticamente.  */
rutas.post('/ingresar', passport.authenticate('iniciar-sesion',{
    successRedirect: '/app',
    failureRedirect: '/',
    //para pasar el request del formulario a passport
    passReqToCallback: true
}));

rutas.post('/iniciarSesion', (req, res, next)=>{
    console.log('llego alguien xD', req.body);
    /* Al usar de esta forma una estrategia de passport,
    SI hay necesidad de llamar al metodo req.logIn() que crea
    por defecto passport, porque de esta forma NO se llama automaticamente. */
    passport.authenticate('local', (err, estado, cliente)=>{
        if(!err){
            if(estado){
                
                /* El metodo req.logIn necesita un usuario, que es el
                que iniciará la sesion y devuelve un callback, el cual
                indica si existe o no un error. */
                req.logIn(cliente, (err)=>{
                    if(err){
                        console.log('Error xD');
                        return res.status(404).send({ERROR: true, mensage: "Error #1 en el servidor"});
                    }else{
                        console.log("sesion iniciada!");
                        return res.status(200).send({ERROR: false, usuario: req.user});
                    }
                });
            }else{
                console.log('Error xD 3');
                return res.status(200).send({ERROR: false, usuario: false, mensage: "Correo o contraseña invalida!"});
            }
        }else{
            console.log('Error xD 2');
            return res.status(404).send({ERROR: true, mensage: "Error #2 en el servidor"});
        }
    })(req, res, next);
    
});

rutas.post('/registrar', passport.authenticate('registrar-cliente',{
    successRedirect: '/app',
    failureRedirect: '/',
    //para pasar el request del formulario
    passReqToCallback: true
}));

rutas.get('/salir', (req, res, next)=>{
    /*Metod req.logOut añadido por defecto por passport
    para eliminar la sesion activa en el momento */
    req.logOut();
    console.log('Sesion cerrada');
    return res.status(200).send({OK: true});
});


module.exports = rutas;