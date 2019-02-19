import * as express from "express";
import * as bodyParser from "body-parser";
import { Sender } from "./sender";

const port = process.env.PORT || 5000;

const users: string[] = [];

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sender = new Sender();

app.get('/api/register', (req, res) => {
    const username = req.query.username;
    if (users.includes(username)) {
        res.sendStatus(403);
        return;
    }

    console.log(username);
    sender.sendRegister(username);
    users.push(username);

    res.sendStatus(200);
});

app.get('/api/delete', (req, res) => {
    const username = req.query.username;
    const index = users.indexOf(username, 0);
    if (index < 0) {
        res.sendStatus(403);
        return;
    }

    console.log(username);
    sender.sendDelete(username);
    users.splice(index, 1);

    res.sendStatus(200);
});

app.listen(port, () => console.log(`Listening on port ${port}`));