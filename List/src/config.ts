declare const process;

export const pomodoroQueue = "pomodoro.queue";
export const accountDeleteTopic = "account.delete";
export const pomodoroStartTopic = "pomodoro.start";
export const pomodoroStopTopic = "pomodoro.stop";

export const config = {
    connection: {
        user: process.env.QUEUE_USERNAME,
        pass: process.env.QUEUE_PASSWORD,
        host: process.env.QUEUE_SERVER || 'localhost',
        port: process.env.QUEUE_PORT || '5672',
        timeout: 2000,
        name: "rabbitmq"
    },
    exchanges: [
        { name: "hello", type: "topic", options: { publishTimeout: 1000, persistent: true, durable: false } }],
    queues: [
        { name: pomodoroQueue, options: { limit: 1000, queueLimit: 1000 } }
    ],
    binding: [
        { exchange: "hello", target: pomodoroQueue, keys: pomodoroStopTopic },        
        { exchange: "hello", target: pomodoroQueue, keys: pomodoroStartTopic },        
        { exchange: "hello", target: pomodoroQueue, keys: accountDeleteTopic }
    ],
    logging: {
        adapters: {
            stdOut: {
                level: 3,
                bailIfDebug: true
            }
        }
    }
}