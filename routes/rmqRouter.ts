const express = require('express');
import { Replies } from 'amqplib';
import RMQServer from '../rmqServer';
import { Request, Response } from 'express';

const rmqRouter = express.Router();

/**
 * rota para iniciar uma conexão com o RMQ
 */
rmqRouter.post('/start', async (req: Request, res: Response) => {
  try {
    const server = RMQServer.getInstance()
    await server.start();
    res.status(200).json({ message: 'connection to RMQ started.' });
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
});

/**
 * rota para criar uma fila usada para trocar
 * as mensagens entre os usuarios
 */
rmqRouter.post('/createQueue', async (req: Request, res: Response) => {
  try {
    // pega o nome da sala do formulario e 
    // cria a queue para a conversa
    const queueName = req.body.queueName;

    const server = RMQServer.getInstance()

    const queue = await server.createQueue(queueName);

    console.log(`${queue.queue} created successfuly.`)
    res.status(201).json({ message: `${queue.queue} created successfuly.`, queue: queue });
  } catch (error: any) {
    res.status(500).json({ message: error.message })
    console.log(error.message)
  }
})



export default rmqRouter;
