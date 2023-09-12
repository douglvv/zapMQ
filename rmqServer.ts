import { Channel, Connection, connect } from 'amqplib';
require('dotenv').config();

// definir url no arquivo dotenv
if (!process.env.URL) throw new Error('Environment variable URL is not defined.');
const URL = process.env.URL;

export default class RMQServer {
  private static instance: RMQServer;
  private conn!: Connection;
  private channel!: Channel;

  private constructor(private url: string) { }

  public static getInstance(): RMQServer {
    if (!RMQServer.instance) RMQServer.instance = new RMQServer(URL);

    return RMQServer.instance;
  }

  public async start(): Promise<void> {
    this.conn = await connect(this.url);
    this.channel = await this.conn.createChannel();
  }

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
}

// cria queue
// envia mensagem
// consume na queue aguardando resposta
// pode enviar novamente outra mensagem repetindo o mesmo processo

// joinar chat
// entra na queue
// consome
// aguarda mensagens
// pode enviar tbm


