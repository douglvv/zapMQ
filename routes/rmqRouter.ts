const express = require('express');
import RMQServer from '../rmqServer';

// const URL = process.env.URL;

const rmqRouter = express.Router();

rmqRouter.post('/start', async (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; }): void; new(): any; }; }; }) => {
  if (!URL) {
    res.status(500).json({ error: 'URL not defined in environment variables' });
    return;
  }

  const server = new RMQServer('amqp://localhost');
  await server.start();
  res.status(200).json({ message: 'RMQ server started' });
});

export default rmqRouter;
