import Broker from "typescript-rabbitmq";
import { config , pomodoroQueue} from "./config";

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
    }
}