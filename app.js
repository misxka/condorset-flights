const path = require('path');

const express = require('express');

const cookieParser = require('cookie-parser');

const cors = require("cors");

const db = require('./util/database');

const app = express();

app.use(cookieParser());
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

const authenticationRoutes = require('./routes/authentication');
const authorizationRoutes = require('./routes/authorization');
const pagesRoutes = require('./routes/pages');
const fetchHandlersRoutes = require('./routes/fetch-handlers');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/authenticate', authenticationRoutes);
app.use('/authorize', authorizationRoutes);
app.use('/pages', pagesRoutes);
app.use('/fetch-handlers', fetchHandlersRoutes);

db.sequelize.sync().then(result => {
  db.initialize();
  console.log('Table created...');
}).catch(err => {
  console.log(err);
})

app.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: 'Расписание Кондорсе',
    path: 'index' 
  });
});

app.get('/pages/create-flights', (req, res, next) => {
  res.render('create-flights', {
    pageTitle: 'Создание расписания',
    path: 'create-flights' 
  });
});

app.get('/pages/voting', (req, res, next) => {
  res.render('voting', {
    pageTitle: 'Голосование',
    path: 'voting' 
  });
});

app.get('/pages/reports', (req, res, next) => {
  res.render('reports', {
    pageTitle: 'Отчёты',
    path: 'reports' 
  });
});

app.get('/pages/admin-voting', (req, res, next) => {
  res.render('admin-voting', {
    pageTitle: 'Голосование',
    path: 'voting' 
  });
});

app.get('/pages/admin-reports', (req, res, next) => {
  res.render('admin-reports', {
    pageTitle: 'Отчёты',
    path: 'reports'
  });
});

app.get('/pages/users', (req, res, next) => {
  res.render('users', {
    pageTitle: 'Пользователи',
    path: 'users' 
  });
});

app.use('/404/', express.static(path.join(__dirname, '/public')));

app.use('/', (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Страница не найдена',
    path: '404'
  });
});


app.listen(3000);