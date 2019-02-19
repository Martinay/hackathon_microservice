import * as amqp from "amqplib/callback_api";
import { config, pomodoroQueue, accountDeleteTopic, pomodoroStartTopic, pomodoroStopTopic } from "./config";
import { getPomodoroInfo, filterPomodoroInfoByName } from "./db";

export class Receiver {
    constructor() {
        amqp.connect('amqp://localhost', (err, conn) => {
            conn.createChannel((err, ch) => {
                var ex = 'hello';

                ch.assertExchange(ex, 'topic', { durable: false });

                ch.assertQueue('', { exclusive: true }, (err, q) => {
                    console.log(' [*] Waiting for logs. To exit press CTRL+C');

                    ch.bindQueue(q.queue, ex, accountDeleteTopic);

                    ch.bindQueue(q.queue, ex, pomodoroStartTopic);
                    ch.bindQueue(q.queue, ex, pomodoroStopTopic);

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

                filterPomodoroInfoByName(msg.content.content);

                console.log(`deleted: getPomodoroInfo() ${getPomodoroInfo()}`);
                break;

            case pomodoroStartTopic:
                console.log(`Detected ${pomodoroStartTopic}`);
                console.log(`registered: msg.content.content ${msg.content.content}`);

                getPomodoroInfo().push({ user: msg.content.content, startTime: Date.now() });

                break;

            case pomodoroStopTopic:

                console.log(`Detected ${pomodoroStopTopic}`);

                filterPomodoroInfoByName(msg.content.content);

                break;
            default:
                console.log(`Hilfe !!!!!!! :( ${msg.fields.routingKey}`);
        }
    }
}