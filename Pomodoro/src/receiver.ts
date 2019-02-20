import * as amqp from "amqplib/callback_api";
import { pomodoroQueue, accountDeleteTopic, accountRegisterTopic } from "./config";
import { users } from "./db";

export class Receiver {
    constructor() {
        amqp.connect('amqp://localhost', (err, conn) => {
            conn.createChannel((err, ch) => {
                var ex = 'hello';

                ch.assertExchange(ex, 'topic', { durable: false });

                ch.assertQueue('', { exclusive: true }, (err, q) => {
                    console.log(' [*] Waiting for logs. To exit press CTRL+C');

                    ch.bindQueue(q.queue, ex, accountDeleteTopic);

                    ch.bindQueue(q.queue, ex, accountRegisterTopic);

                    ch.consume(q.queue, (msg) => {
                        this.taskCB(msg)
                    }, { noAck: true });
                });
            });
        });
    }

    taskCB(msg) {

        msg.content = { data: "string", content: msg.content.toString() };
        console.log("taskCB: [%s]: taskCB %s:'%s'",
            msg.properties.headers.messageId,
            msg.fields.routingKey,
            msg.content.toString());
        console.log("taskCB: [%s] msg = %s", msg.properties.headers.messageId, JSON.stringify(msg, undefined, 2));
        console.log("");

        switch (msg.fields.routingKey) {
            case accountDeleteTopic:
                console.log(`Detected ${accountDeleteTopic}`);
                const index = users.indexOf(msg.content.content, 0);
                console.log(`deleted: msg.content.content ${msg.content.content}`);

                users.splice(index, 1);

                break;

            case accountRegisterTopic:
                console.log(`Detected ${accountRegisterTopic}`);
                console.log(`registered: msg.content.content ${msg.content.content}`);

                users.push(msg.content.content);

                break;
            default:
                console.log(`Hilfe !!!!!!! :( ${msg.fields.routingKey}`);
        }
    }
}