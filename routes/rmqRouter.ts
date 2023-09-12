const express = require('express');
import RMQServer from '../rmqServer';

const rmqRouter = express.Router();

rmqRouter.post('/start', async (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; }): void; new(): any; }; }; }) => {
  const server = RMQServer.getInstance()
  await server.start();
  res.status(200).json({ message: 'connection to RMQ started.' });
});

export default rmqRouter;
