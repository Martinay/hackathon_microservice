import Broker from "typescript-rabbitmq";
import { config, pomodoroQueue, accountDeleteTopic, accountRegisterTopic } from "./config";
import { users } from "./db";

export class Receiver {
    broker: Broker;
    ison: boolean;

    constructor() {
        this.ison = false;
        this.broker = new Broker(config);
    }

    async init() {
        this.broker.addConsume(pomodoroQueue, this.taskCB.bind(this));

        this.ison = true;
        return this;
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

        switch (msg.fields.exchange) {
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
        }
    }
}