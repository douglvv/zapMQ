import { Channel, Connection, connect } from 'amqplib';
require('dotenv').config();

// definir URL no arquivo dotenv
if (!process.env.URL) throw new Error('Environment variable URL is not defined.');
const URL = process.env.URL;

export default class RMQServer {
  private static instance: RMQServer;
  private conn!: Connection;
  private channel!: Channel;

  private constructor(private url: string) { }

  // singleton para acessar o objeto da conexão com o rmq
  public static getInstance(): RMQServer {
    if (!RMQServer.instance) RMQServer.instance = new RMQServer(URL);

    return RMQServer.instance;
  }

  /**
   * inicia uma conexão e cria um channel no RMQ
   */
  public async start(): Promise<void> {
    this.conn = await connect(this.url);
    this.channel = await this.conn.createChannel();
  }

  /**
   * cria uma fila no servidor do RMQ
   * @param queueName: string 
   * @returns queue object
   */
  public async createQueue(queueName: string) {
    // inicia uma conexão caso não haja uma
    if (!this.conn || !this.channel) {
      const rmqServer = RMQServer.getInstance()
      rmqServer.start()
    }

    // cria a queue para o chat
    const queue = await this.channel.assertQueue(queueName, { durable: true })

    return queue;
  }

  /**
   * envia uma mensagem para uma fila
   * @param queueName: string
   * @param message {message: string, timestamp: Date, sender: string}
   */
  public async sendMessage(
    queueName: string,
    message: { message: string, timestamp: string, sender: string }
  ) {
    // inicia uma conexão caso não haja uma
    if (!this.conn || !this.channel) {
      const rmqServer = RMQServer.getInstance()
      rmqServer.start()
    }

    const queue = await this.channel.assertQueue(queueName);
    if (!queue) return false

    // envia a mensagem para a queue
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    return true
  }

}



