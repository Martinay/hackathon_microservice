import * as amqp from "amqplib";
import { pomodoroStartTopic, pomodoroStopTopic } from "./config";
import uuid = require('uuid');

export class Sender {
    private channel: amqp.Channel;

    private hash: string = uuid.v4();
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
                channel.assertExchange("hello", 'topic', { durable: false }).then(ok => console.log(`connected to hello`));
                this.channel = channel;
            })
        });
    }

    public sendStart(name:string): void {        
        let key = pomodoroStartTopic;
        let message = name;
        this.options.headers.source = pomodoroStartTopic + ":" + key;
        this.channel.publish("hello", key, Buffer.from(message));
        console.log(`published to ${pomodoroStartTopic} : ${message}`)
    }

    public sendStop(name:string): void {        
        let key = pomodoroStopTopic;
        let message = name;
        this.options.headers.source = pomodoroStopTopic + ":" + key;
        this.channel.publish("hello", key, Buffer.from(message));
        console.log(`published to ${pomodoroStopTopic} : ${message}`)
    }
}