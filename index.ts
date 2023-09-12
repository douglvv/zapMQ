const express = require('express');
import rmqRouter from './routes/rmqRouter.js';

const app = express();

// middlewares
app.use(express.json());
app.use(express.static('public'))
app.use('/', rmqRouter)

// rotas
// app.get('/', function (req, res) { res.send('ok') }); // rota inicial para teste

// server
const PORT = 3000;

try {
    const server = app.listen(PORT, () => {
        console.log('server listening on port ', PORT);
    })
} catch (error: any) {
    console.log(error.message)
}
