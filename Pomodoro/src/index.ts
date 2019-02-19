import * as express from "express";
import * as bodyParser from "body-parser";
import { Sender } from "./sender";
import { Receiver } from "./receiver";
import { users } from "./db";

const port = process.env.PORT || 5001;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sender = new Sender();
const receiver = new Receiver();

app.get('/api/start', (req, res) => {
    const username = req.query.username;
    if (!users.includes(username)) {
        res.sendStatus(403);
        return;
    }

    console.log(username);
    sender.sendStart(username);

    res.sendStatus(200);
});

app.get('/api/stop', (req, res) => {
    const username = req.query.username;
    if (!users.includes(username)) {
        res.sendStatus(403);
        return;
    }

    console.log(username);
    sender.sendStop(username);

    res.sendStatus(200);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

