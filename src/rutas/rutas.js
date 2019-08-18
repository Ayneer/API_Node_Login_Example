const express = require('express');
const rutas = express.Router();
const passport = require('passport');

rutas.get('/', (req, res, next)=>{
    res.send("Inicio, tienes que iniciar sesion");
});

rutas.get('/app', (req, res, next)=>{
    if(req.isAuthenticated()){
        res.send(req.user);
    }else{
        res.redirect('/');
    }
});

rutas.post('/ingresar', passport.authenticate('iniciar-sesion',{
    successRedirect: '/app',
    failureRedirect: '/',
    //para pasar el request del formulario
    passReqToCallback: true
}));

rutas.post('/registrar', passport.authenticate('registrar-cliente',{
    successRedirect: '/app',
    failureRedirect: '/',
    //para pasar el request del formulario
    passReqToCallback: true
}));

rutas.get('/salir', (req, res, next)=>{
    req.logOut();
    res.redirect('/');
});


module.exports = rutas;