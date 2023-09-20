"use strict";
exports.__esModule = true;
var express = require('express');
var createServer = require("http").createServer;
var Server = require("socket.io").Server;
var rmqRouter_js_1 = require("./routes/rmqRouter.js");
// import RMQServer from './rmqServer.js'
var cors = require('cors'); // Libera requisições externas para a api
require('dotenv').config();
var app = express();
var server = createServer(app);
var io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/', rmqRouter_js_1["default"]);
io.on('connection', function (socket) {
    console.log('A user connected');
    // Handle disconnection
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    socket.on('join', function (data) {
        var chatName = data.chatName;
        socket.join('chatName');
    });
});
// rotas
// app.get('/', function (req, res) { res.send('ok') }); // rota inicial para teste
// server
// definir PORT no arquivo dotenv
if (!process.env.PORT)
    throw new Error('environment variable PORT is not defined.');
var PORT = process.env.PORT;
try {
    app.listen(PORT, function () {
        console.log('server listening on port ', PORT);
        // rmqServer.start()
        // console.log('connected to RMQ server')
    });
}
catch (error) {
    console.log(error.message);
}
