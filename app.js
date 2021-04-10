const path = require('path');

const express = require('express');
const session = require('express-session');
const pool = require(path.join(__dirname, 'util', 'database'));

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: 'condorcet',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/sign-in', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
	if (username && password) {
		pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
	  	if(error) {
        return res.status(500).send("Возникла ошибка");
      }
      if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/');
			} else {
				res.send('Неверный логин и/или пароль!'); 
			}		
		});
	console.log('sdfghjk');
	}
});

// app.get('/home', (req, res, next) => {
// 	if (req.session.loggedin) {
// 		res.send('Добро пожаловать, ' + req.session.username + '!');
// 	} else {
// 		res.send('Авторизуйтесь, чтобы просматривать эту страницу!');
// 	}
// });

app.listen(3000);