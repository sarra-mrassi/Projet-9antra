var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const http = require('http');

require('dotenv').config();
const { connectToBd } = require('./config/mongo.connection.');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.routes');
var reservationsRouter = require('./routes/reservations.routes');
var servicesRouter = require('./routes/services.routes');
var avisRouter = require('./routes/avis.routes');
var adminRouter = require('./routes/admin.routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 2 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/reservations', reservationsRouter);
app.use('/api/services', servicesRouter);
app.use('/services', servicesRouter);
app.use('/avis', avisRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});
const startServer = (port = Number(process.env.PORT) || 3000) => {
  const server = http.createServer(app);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} déjà utilisé, tentative sur ${port + 1}...`);
      startServer(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, () => {
    connectToBd();
    console.log(`Server is running on port ${port}`);
  });
};

startServer();

