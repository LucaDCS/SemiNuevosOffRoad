const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
var favicon = require('serve-favicon');

const app = express();

const partialsPath = path.join(__dirname, 'templates/partials')

// settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'templates/views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: partialsPath
}));
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

// rutes
app.use(require('./routes'));

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','assets','favicon.ico')));

// Serve
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto: ${app.get('port')}`)
})
module.exports = app;