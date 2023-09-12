"use strict";
exports.__esModule = true;
var express = require('express');
var rmqRouter_js_1 = require("./routes/rmqRouter.js");
var rmqServer_js_1 = require("./rmqServer.js");
require('dotenv').config();
var app = express();
var rmqServer = rmqServer_js_1["default"].getInstance();
// middlewares
app.use(express.json());
app.use(express.static('public'));
app.use('/', rmqRouter_js_1["default"]);
// rotas
// app.get('/', function (req, res) { res.send('ok') }); // rota inicial para teste
// server
if (!process.env.PORT)
    throw new Error('environment variable PORT is not defined.');
var PORT = process.env.PORT;
try {
    var server = app.listen(PORT, function () {
        console.log('server listening on port ', PORT);
        rmqServer.start();
        console.log('connected to RMQ server');
    });
}
catch (error) {
    console.log(error.message);
}
