import { Channel, Connection, Message, connect } from 'amqplib';
import { Server } from 'socket.io';
require('dotenv').config();

// definir URL no arquivo dotenv
if (!process.env.URL) throw new Error('Environment variable URL is not defined.');
const URL = process.env.URL;

export default class RMQServer {
  private static instance: RMQServer;
  private conn!: Connection;
  private channel!: Channel;
  private io!: Server;

  private constructor(private url: string) { 
    this.io = new Server();
  }

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
    // inicia a conexão caso já não 
    // tenha sido iniciada
    if (!this.conn || !this.channel) {
      var rmqServer = RMQServer.getInstance()
      rmqServer.start()
    }

    // cria a fila das conversa
    const queue = await this.channel.assertQueue(queueName, { durable: true })

    return queue;
  }

  /**
   * envia uma mensagem para uma fila
   * @param queueName: string
   * @param message {message: string, timestamp: Date, sender: string}
   */
  public async sendMessage(queueName: string, message: { message: string, timestamp: Date, sender: string }) {
    if (!this.conn || !this.channel) {
      var rmqServer = RMQServer.getInstance()
      rmqServer.start()
    }

    const queue = await this.channel.assertQueue(queueName);
    if (!queue) return false

    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    return true
  }

  /**
   * começa a consumir a fila passada por
   * parâmetro
   * @param queueName: string
   * @returns 
   */
  public consumeQueue(queueName: string) {
    // Ensure that the connection and channel are initialized
    // if (!this.conn || !this.channel) {
    //   await this.start();
    // }

    // Start consuming messages from the queue
    this.channel.consume(queueName, (msg: Message | null) => {
      if (!msg) {
        // No message received, continue listening
        return;
      }

      try {
        const message = JSON.parse(msg.content.toString());

        // Emit the message to connected clients
        this.io.to(queueName).emit('newMessage', message);

        // Acknowledge the message to remove it from the queue
        // this.channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
  }
  
}



