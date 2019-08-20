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
                        return res.send('error');
                    }else{
                        return res.redirect('/app');
                    }
                });
            }else{
                return res.send('Correo o contraseña invalida!');
            }
        }else{
            return res.send('err: ', err);
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
    return res.redirect('/');
});


module.exports = rutas;