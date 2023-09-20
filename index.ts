const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
import { Socket } from 'socket.io';
import rmqRouter from './routes/rmqRouter.js';


// import RMQServer from './rmqServer.js'
const cors = require('cors'); // Libera requisições externas para a api

require('dotenv').config();

const app = express();
const server = createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use('/', rmqRouter)

io.on('connection', (socket: Socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('join',(data) => {
        const chatName = data.chatName
        socket.join('chatName');
    } )
});


// rotas
// app.get('/', function (req, res) { res.send('ok') }); // rota inicial para teste

// server
// definir PORT no arquivo dotenv
if (!process.env.PORT) throw new Error('environment variable PORT is not defined.');
const PORT = process.env.PORT
try {
    app.listen(PORT, () => {
        console.log('server listening on port ', PORT);
        // rmqServer.start()
        // console.log('connected to RMQ server')
    })
} catch (error: any) {
    console.log(error.message)
}
