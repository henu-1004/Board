//app.js
const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;
const connection = require('./database');

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'asd123!', 
  resave: false,
  saveUninitialized: false 
}));

const router = require('./routes/index');
app.use('/', router);

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}/`);
});
