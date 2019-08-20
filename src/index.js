const express = require('express');
const bodyParse = require('body-parser');
const rutas = require('./rutas/rutas');
const passport = require('passport');
const session = require('express-session');
const MongoEstore = require('connect-mongo')(session);
const app = new express();

require('./baseDatos');
require('./autenticacion/local');

app.set('puerto', process.env.PORT || 3000);

app.use(bodyParse.urlencoded({extended: false}));

/*
Configuración de la sesion.
*/
app.use(session({
    secret: 'secretoLlave@',
    resave: false,
    saveUninitialized: false,
    /*
    Para almacenar algun valor critico de la sesion en la base de datos,
    por ejemplo: session.miVariable = "hola";
    sotore: new MongoEstore({
        url: 'mongodb://localhost:27017/login',
        autoReconnect: true
    })
    */
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/', rutas);

app.listen(app.get('puerto'), ()=>{
    console.log('servidor escuchando en http://localhost:',app.get('puerto'));
});

