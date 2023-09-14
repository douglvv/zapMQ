"use strict";
exports.__esModule = true;
var express = require('express');
var rmqRouter_js_1 = require("./routes/rmqRouter.js");
// import RMQServer from './rmqServer.js'
var cors = require('cors'); // Libera requisições externas para a api
require('dotenv').config();
var app = express();
// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/', rmqRouter_js_1["default"]);
// rotas
// app.get('/', function (req, res) { res.send('ok') }); // rota inicial para teste
// server
// definir PORT no arquivo dotenv
if (!process.env.PORT)
    throw new Error('environment variable PORT is not defined.');
var PORT = process.env.PORT;
try {
    var server = app.listen(PORT, function () {
        console.log('server listening on port ', PORT);
        // rmqServer.start()
        // console.log('connected to RMQ server')
    });
}
catch (error) {
    console.log(error.message);
}
