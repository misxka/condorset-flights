const path = require('path');

const express = require('express');
const session = require('express-session');

const jwt = require('jsonwebtoken');

const db = require('./util/database');

const pool = require(path.join(__dirname, 'util', 'database'));

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const authenticationRoutes = require('./routes/authentication');
const authorizationRoutes = require('./routes/authorization');

app.use(session({
  secret: 'condorcet',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/authenticate', authenticationRoutes);
app.use('/authorize', authorizationRoutes);

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

db.sequelize.sync().then(result => {
  db.initialize();
	console.log('Table created...');
}).catch(err => {
	console.log(err);
})

app.listen(3000);