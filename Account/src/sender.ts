import * as amqp from "amqplib";
import { accountRegisterTopic, accountDeleteTopic } from "./config";

export class Sender {
    private channel: amqp.Channel;

    constructor() {
        amqp.connect('amqp://localhost').then(conn => {
            conn.createChannel().then(channel => {
                channel.assertExchange("hello", 'topic', { durable: false }).then(ok => console.log(`connected to hello`));
                this.channel = channel;
            })
        });
    }

    public sendRegister(name:string): void {        
        let key = accountRegisterTopic;
        let message = name;
        this.channel.publish("hello", key, Buffer.from(message));
        console.log(`published to ${accountRegisterTopic} : ${message}`)
    }

    public sendDelete(name:string): void {        
        let key = accountDeleteTopic;
        let message = name;
        this.channel.publish("hello", key, Buffer.from(message));
        console.log(`published to ${accountDeleteTopic} : ${message}`)
    }
}