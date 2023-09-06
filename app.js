const express = require('express');
const {engine} = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//parsing middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//parse application/json
app.use(bodyParser.json());

// static files
app.use(express.static('public'));

// templating engine 
app.engine('hbs', engine( {extname: '.hbs' }));
app.set('view engine', 'hbs');

//connection pool

const pool = mysql.createPool({
connectionLimit : 100,
host            : process.env.DB_HOST,
user            : process.env.DB_USER,
password        : process.env.DB_PASS,
database        : process.env.DB_NAME
});

//connect to DB 
pool.getConnection((err, connection) => {
  if(err) throw err; // not connected
  console.log('connected as ID' + connection.threadId);
});

const routes = require('./server/routes/user');
app.use('/', routes);

//router
// app.get('', (req, res) => {
//   res.render('home');
// });

app.listen(port, () => console.log(`Listening on port ${port}`)); 
