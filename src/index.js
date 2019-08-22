const express = require('express');
const bodyParse = require('body-parser');
const rutas = require('./rutas/rutas');
const passport = require('passport');
const session = require('express-session');
const MongoEstore = require('connect-mongo')(session);
const app = new express();

require('./baseDatos');
require('./autenticacion/local');

app.set('puerto', process.env.PORT || 3500);

app.use(bodyParse.urlencoded({extended: false}));
app.use(express.json());
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

// SOLO EN MODO DEV, EN PRODUCCIÓN BORRAR ESTO!!
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use('/', rutas);

app.listen(app.get('puerto'), ()=>{
    console.log('servidor escuchando en http://localhost:',app.get('puerto'));
});

