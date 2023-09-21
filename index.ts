const express = require('express');
import rmqRouter from './routes/rmqRouter.js';
import RMQServer from './rmqServer.js';
import { Request, Response } from 'express';


// import RMQServer from './rmqServer.js'
const cors = require('cors'); // Libera requisições externas para a api

require('dotenv').config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use('/', rmqRouter)

// rotas
app.get('/', function (req: Request, res: Response) { res.send('ok') }); // rota inicial para teste

// server
// definir PORT no arquivo dotenv
if (!process.env.PORT) throw new Error('environment variable PORT is not defined.');
const PORT = process.env.PORT
try {
    app.listen(PORT, async () => {
        console.log('server listenin on port', PORT)
        // const RMQConn = RMQServer.getInstance()
        // await RMQConn.start()
        // await RMQConn.createQueue("chat")
    })
} catch (error: any) {
    console.log(error.message)
}
