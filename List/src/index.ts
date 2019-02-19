import * as express from "express";
import * as bodyParser from "body-parser";
import { Receiver } from "./receiver";
import { getPomodoroInfo } from "./db";

const port = process.env.PORT || 5002;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const receiver = new Receiver();

app.get('/api/get', (req, res) => {
    console.log(`get: ${getPomodoroInfo()}`);

    res.send(JSON.stringify(getPomodoroInfo()));
});

app.listen(port, () => console.log(`Listening on port ${port}`));

