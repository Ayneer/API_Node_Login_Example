const express = require('express');
const bodyParse = require('body-parser');
const rutas = require('./rutas/rutas');
const passport = require('passport');
const session = require('express-session');
const app = new express();

require('./baseDatos');
require('./autenticacion/local');

app.set('puerto', process.env.PORT || 3000);

app.use(bodyParse.urlencoded({extended: false}));
app.use(session({
    secret: 'secretoLlave@',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', rutas);

app.listen(app.get('puerto'), ()=>{
    console.log('servidor escuchando en http://localhost:',app.get('puerto'));
});

