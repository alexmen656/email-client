import express from 'express';
import cors from 'cors';
import { fetchEmails } from './load.js';

const app = express();
const port = 3000;

app.use(cors());

app.get('/emails', (req, res) => {
    fetchEmails((err, emails) => {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.json(emails);
        }
    });
});

app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});