var amqp = require('amqplib/callback_api');
const { Channel } = require('amqplib/lib/channel');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    console.log(connection)
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});


// const connection = amqp.connect('amqp://localhost', { clientProperties: { connection_name: 'fodase' } });
// console.log('connection: ', connection)

// const channel = new Channel(connection)
// console.log('channel: ', channel)

// const queue = 'fila_qualquer'

// channel.

// channel.assertQueue(queue, {
//     durable: false
// });

// console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

// channel.consume(queue, function (msg) {
//     console.log(" [x] Received %s", msg.content.toString());
// }, {
//     noAck: true
// });
