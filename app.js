import createError from 'http-errors';
import express from 'express';
import path from 'path'
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenvSafe from 'dotenv-safe';
import cors from 'cors';
dotenvSafe.config();

import indexRouter from './src/routes/index.js';
import usersRouter from './src/routes/users.js';
import graphsRouter from './src/routes/graphs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/graphs', graphsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
