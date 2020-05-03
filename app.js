const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const winston = require('./config/winston');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config()

const indexRouter = require('./routes/index');
const waitlistRouter = require('./routes/waitlist');
const app = express();

app.use(morgan('combined', {
    stream: winston.stream
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use('/', indexRouter);
app.use('/list', waitlistRouter);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // add this line to include winston logging
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

mongoose.connect(process.env.MONGO_URL || '', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify:true
    })
    .then(() => {
        console.log('MongoDB Connection Started');
    })
    .catch(err => console.log(err.message));
module.exports = app;