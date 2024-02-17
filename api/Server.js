const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const methodOverride = require('method-override')
const debug = require('debug')('v1:server');
const Config = require(process.cwd() + '/Config');
const session = require('express-session');
const uuid = require('uuid');
const path = require('path');
const moment = require('moment-timezone');
moment.locale('id');



const Controllers = {};
const Controllers_path = process.cwd() + '/Controllers';

fs.readdirSync(Controllers_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        Controllers[file.split('.')[1]] = require(Controllers_path + '/' + file);
    }
});

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        let con = await mongoose.connect(Config.Dbname, {});

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

connectDB();

const app = express();
app.set('trust proxy', true);
const server = http.createServer(app);

app.use(methodOverride());

//app.use(logger('dev'));

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '150mb'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', Controllers.Root.Index);
app.post('/root', Controllers.Root.CekToken, Controllers.Root.postRoot);
app.post('/root/login', Controllers.Root.Login);

app.post('/pelanggan', Controllers.Root.CekToken, Controllers.Pelanggan.postPelanggan);
app.get('/pelanggan/:id', Controllers.Root.CekToken, Controllers.Pelanggan.getProfil);

app.post('/layanan', Controllers.Root.CekToken, Controllers.Layanan.postLayanan);
app.post('/layanan/produk', Controllers.Root.CekToken, Controllers.Layanan.postProduk);

function normalizePort(val) {
    var port = parseInt(val, 10);
    console.log('API Running on Port: ' + port)
    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    //console.log(err.status)
    //console.log(err.message)
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    return res.status(err.status).send({
        pesan: err.message
    })
});

const port = normalizePort(process.env.PORT || '3002');
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
