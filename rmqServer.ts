import { Channel, Connection, connect } from 'amqplib';
require('dotenv').config();

// definir URL no arquivo dotenv
if (!process.env.URL) throw new Error('Environment variable URL is not defined.');
const URL = process.env.URL;

export default class RMQServer {
  private static instance: RMQServer;
  private conn!: Connection;
  private channel!: Channel;

  public constructor(private url: string) { }

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
  public async consumeQueue(queueName: string) {
    const messages: any[] = [];
    // verifica se a fila existe antes consumir
    const queue = await this.channel.assertQueue(queueName);
    if(!queue) return false

    while (true) {
      // consome a fila
      await new Promise<void>((resolve) => {
        this.channel.consume(queueName, async (msg) => {
          if (!msg) {
            // caso nao tenha mensagem continua ouvindo
            return;
          }
  
          try {
            const message = JSON.parse(msg.content.toString());
            console.log(`Received message: ${message.message} from queue ${queueName}`);
  
            // salva a mensagem na array
            messages.push(message);
  
            // Acknowledge na mensagem para remover da fila
            // this.channel.ack(msg);

            resolve();
          } catch (error) {
            console.error('Error processing message:', error);
            resolve();
          }
        });
      });
  
      // aguarda 10ms antes de procurar por novas mensagens
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
  
}



