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

/**
 * rota para enviar mensagens para uma fila
 */
rmqRouter.post('/sendMessage', async (req: Request, res: Response) => {
  try {
    const { queueName, message } = req.body;
    if (!queueName || !message) return res.status(400).json({ message: 'missing message or queue' });

    const server = RMQServer.getInstance()

    const result = await server.sendMessage(queueName, message);
    if (!result) return res.status(404).json({ message: 'queue not found.' });

    res.status(200).json({ message: `message: ${message} sent to ${queueName} successfuly.` });
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
})

rmqRouter.post('/consumeQueue', async (req: Request, res: Response) => {
  const queueName = req.body.queueName
  if (!queueName) return res.status(400).json({ message: 'missing queue name' })

  const server = RMQServer.getInstance()
  const message: any = await server.consumeQueue(queueName);
  
  console.log(message);
  res.status(200).json({ message: message });

})

// API endpoint to start message consumption
rmqRouter.get('/consumeQueue/:queueName', async (req: Request, res: Response) => {
  try {
    const queueName = req.params.queueName;
    if (!queueName) {
      return res.status(400).json({ message: 'Queue name is required.' });
    }

    const server = RMQServer.getInstance();
    const messages = await server.consumeQueue(queueName);

    res.json({ messages });
  } catch (error) {
    console.error('Error in message consumption:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



export default rmqRouter;
