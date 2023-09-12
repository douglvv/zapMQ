const express = require('express');
import rmqRouter from './routes/rmqRouter.js';
import RMQServer from './rmqServer.js';
require('dotenv').config();

const app = express();
const rmqServer = RMQServer.getInstance();

// middlewares
app.use(express.json());
app.use(express.static('public'))
app.use('/', rmqRouter)

// rotas
// app.get('/', function (req, res) { res.send('ok') }); // rota inicial para teste

// server
if (!process.env.PORT) throw new Error('environment variable PORT is not defined.');
const PORT = process.env.PORT
try {
    const server = app.listen(PORT, () => {
        console.log('server listening on port ', PORT);     
        rmqServer.start()
        console.log('connected to RMQ server')
    })
} catch (error: any) {
    console.log(error.message)
}