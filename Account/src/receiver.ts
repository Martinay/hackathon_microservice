import Broker from "typescript-rabbitmq";
import { config } from "./config";

export class Receiver {
    broker: Broker;
    ison: boolean;

    constructor() {
        this.ison = false;
        this.broker = new Broker(config);
    }

    async init() {
        await this.broker.connect();

        this.broker.addConsume("work.tasks.queue", this.taskCB.bind(this));

        return this;
    }

    receive(ison) {
        this.ison = ison;
    }

    taskCB(msg) {
        if (!this.ison) { return }

        msg.content = { data: "string", content: msg.content.toString() };
        console.log("taskCB: [%s]: taskCB %s:'%s'",
            msg.properties.headers.messageId,
            msg.fields.routingKey,
            msg.content.toString());
        console.log("taskCB: [%s] msg = %s", msg.properties.headers.messageId, JSON.stringify(msg, undefined, 2));
        console.log("");
    }
}