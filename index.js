const express = require('express');
const app = express();
const controller = require('./controller.js');
// middlewares
app.use(express.json());
app.use(express.static('public'))

// rotas
const router = express.Router()
app.get('/', function (req, res) { res.send('ok') }); // rota inicial para teste




// server
const PORT = 3000;

try {
    const server = app.listen(PORT, () => {
        console.log('server listening on port ', PORT);
    })
} catch (error) {
    console.log(error.message)
}
