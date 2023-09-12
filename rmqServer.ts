import { Channel, Connection, connect } from 'amqplib';

export default class RMQServer {
  private conn!: Connection;
  private channel!: Channel;

  constructor(private url: string) {}

  async start(): Promise<void> {
    this.conn = await connect(this.url);
    this.channel = await this.conn.createChannel();
  }
}
