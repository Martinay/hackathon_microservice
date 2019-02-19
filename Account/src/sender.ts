import * as amqp from "amqplib";
import { accountRegisterTopic, accountDeleteTopic } from "./config";
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
                channel.assertExchange(accountRegisterTopic, 'topic', { durable: false }).then(ok => console.log(`connected to ${accountRegisterTopic}`));
                channel.assertExchange(accountDeleteTopic, 'topic', { durable: false }).then(ok => console.log(`connected to ${accountDeleteTopic}`));
                this.channel = channel;
            })
        });
    }

    public sendRegister(name:string): void {        
        let key = accountRegisterTopic;
        let message = name;
        this.options.headers.source = accountRegisterTopic + ":" + key;
        this.channel.publish(accountRegisterTopic, key, Buffer.from(message), this.options);
        console.log(`published to ${accountRegisterTopic} : ${message}`)
    }

    public sendDelete(name:string): void {        
        let key = accountDeleteTopic;
        let message = name;
        this.options.headers.source = accountDeleteTopic + ":" + key;
        this.channel.publish(accountDeleteTopic, key, Buffer.from(message), this.options);
        console.log(`published to ${accountDeleteTopic} : ${message}`)
    }
}