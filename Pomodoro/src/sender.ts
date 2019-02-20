import * as amqp from "amqplib";
import { pomodoroStartTopic, pomodoroStopTopic } from "./config";

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

    public sendStart(name:string): void {        
        let key = pomodoroStartTopic;
        let message = name;
        this.channel.publish("hello", key, Buffer.from(message));
        console.log(`published to ${pomodoroStartTopic} : ${message}`)
    }

    public sendStop(name:string): void {        
        let key = pomodoroStopTopic;
        let message = name;
        this.channel.publish("hello", key, Buffer.from(message));
        console.log(`published to ${pomodoroStopTopic} : ${message}`)
    }
}