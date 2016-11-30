const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routing = require('./src/server/router');

const app = express();

/**
 * For timestamped console messages.
 * It makes for easier debugging.
 */
require('log-timestamp');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'ult1m4t3 53cr3t',
  resave: true,
  saveUninitialized: true
}));

app.use('/', routing);

// Set the view engine to handlebars.
app.set('views', 'views/');
app.engine('.hbs', exphbs({
  layoutsDir: 'views/',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use('/',  express.static('./public'));

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Listening on port:', port);
});
