import { Channel, Connection, connect } from 'amqplib';
require('dotenv').config();

if (!process.env.URL) throw new Error('Environment variable URL is not defined.');
const URL = process.env.URL;

export default class RMQServer {
  private static instance: RMQServer;
  private conn!: Connection;
  private channel!: Channel;

  private constructor(private url: string) {}

  public static getInstance(): RMQServer {
    if (!RMQServer.instance) RMQServer.instance = new RMQServer('amqp://localhost');

    return RMQServer.instance;
  }

  async start(): Promise<void> {
    this.conn = await connect(this.url);
    this.channel = await this.conn.createChannel();
  }

  async publishInQueue(message: string, queue: string) {
    // Implement your message publishing logic here
  }
}
