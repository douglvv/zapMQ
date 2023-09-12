const express = require('express');
import { Replies } from 'amqplib';
import RMQServer from '../rmqServer';

const rmqRouter = express.Router();

rmqRouter.post('/start', async (req, res) => {
  const server = RMQServer.getInstance()
  await server.start();
  res.status(200).json({ message: 'connection to RMQ started.' });
});

rmqRouter.post('/createQueue', async (req, res) => {
  try {
    // pega o nome da sala do formulario e 
    // cria a queue para a conversa
    const queueName = req.body.queueName;
    console.log(queueName)
    
    const server = RMQServer.getInstance()

    const queue = await server.createQueue(queueName);
    console.log(queue)

    res.status(201).json({message: 'queue created successfuly.', queue: queue});
  } catch (error: any) {
    console.log(error.message)
  }
})



export default rmqRouter;
