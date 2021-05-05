const path = require('path');

const express = require('express');

const cookieParser = require('cookie-parser');

const db = require('./util/database');

const pool = require(path.join(__dirname, 'util', 'database'));

const app = express();

app.use(cookieParser());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

const authenticationRoutes = require('./routes/authentication');
const authorizationRoutes = require('./routes/authorization');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/authenticate', authenticationRoutes);

app.use('/authorize', authorizationRoutes);

// const flights = [
//   {
//     date: '03/05/2021',
//     from: 'MSQ Minsk',
//     to: 'SVO Moscow',
//     airlineId: 'SU',
//     flightNumber: '5265'
//   },
//   {
//     date: '03/05/2021',
//     from: 'MSQ Minsk',
//     to: 'VKO Moscow',
//     airlineId: 'SU',
//     flightNumber: '5365'
//   }
// ]

// app.get('/flights', (req,res,next) => {
//   res.json(flights);
// });

app.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: 'Расписание Кондорсе',
    path: 'index' 
  });
});

app.get('/create-flights', (req, res, next) => {
  res.render('create-flights', {
    pageTitle: 'Создание расписания',
    path: 'create-flights' 
  });
});

app.get('/voting', (req, res, next) => {
  res.render('voting', {
    pageTitle: 'Голосование',
    path: 'voting' 
  });
});

app.get('/reports', (req, res, next) => {
  res.render('reports', {
    pageTitle: 'Отчёты',
    path: 'reports' 
  });
});

app.use('/404/', express.static(path.join(__dirname, '/public')));

app.use('/', (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Страница не найдена',
    path: '404'
  });
});

db.sequelize.sync().then(result => {
  db.initialize();
	console.log('Table created...');
}).catch(err => {
	console.log(err);
})

app.listen(3000);