import * as amqp from "amqplib";
import { pomodoroStartTopic, pomodoroStopTopic } from "./config";
//import uuid = require('uuid');

export class Sender {
    private channel: amqp.Channel;

    private hash: string = '1234'; // uuid.uuidv1();
    private sessionId: string = '1234';
    private options = {
        persistent: false,
        noAck: true,
        timestamp: Date.now(),
        contentEncoding: "utf-8",
        contentType: "application/json",
        headers: {
            messageId: this.hash,
            sessionId: this.sessionId,
            source: ""
        }
    };

    constructor() {
        amqp.connect('amqp://localhost').then(conn => {
            conn.createChannel().then(channel => {
                channel.assertExchange(pomodoroStartTopic, 'topic', { durable: false }).then(ok => console.log(`connected to ${pomodoroStartTopic}`));
                channel.assertExchange(pomodoroStopTopic, 'topic', { durable: false }).then(ok => console.log(`connected to ${pomodoroStopTopic}`));
                this.channel = channel;
            })
        });
    }

    public sendStart(name:string): void {        
        let key = 'loopback.tasks';
        let message = name;
        this.options.headers.source = pomodoroStartTopic + ":" + key;
        this.channel.publish(pomodoroStartTopic, key, Buffer.from(message), this.options);
        console.log(`published to ${pomodoroStartTopic} : ${message}`)
    }

    public sendStop(name:string): void {        
        let key = 'loopback.tasks';
        let message = name;
        this.options.headers.source = pomodoroStopTopic + ":" + key;
        this.channel.publish(pomodoroStopTopic, key, Buffer.from(message), this.options);
        console.log(`published to ${pomodoroStopTopic} : ${message}`)
    }
}