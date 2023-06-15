const express = require('express');
const fs = require('fs');
const app = express();

const movieRouter = require('./Routes/moviesRouter');
const globalErrorHandler = require('./Controllers/errorController');
const customError = require('./Utils/CustomError');

const { error } = require('console');

//const morgan = require('morgan');
app.use(express.static('./public'));

app.use(express.json());

//app.use(morgan('dev'));


app.use('/api/v1/movies',movieRouter)

app.all('*',(req,res,next)=>{
    const err = new customError(`cant find ${req.originalUrl}this url on server`,404);
    next(err);

})

app.use(globalErrorHandler)

module.exports = app;