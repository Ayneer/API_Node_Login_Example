const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/login', {useNewUrlParser: true})
.then(console.log('Conectado a la base de datos'))
.catch(err => console.log(err))