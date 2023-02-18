const express = require('express');
const cors = require('cors');
const http = require('http');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.set('trust proxy', 1);
app.use(cors({
    origin: '*'
}));
app.use('/api**', (req, res) => {
    console.log(`Request from [${req.ip}], host [${req.query.host}], method: [${req.method}], to [${req.baseUrl}]`);
    const headers = {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization
    };
    switch (req.method) {
        case 'GET':
            axios.get(`${req.query.host}${req.baseUrl}`, {
                headers: headers,
                timeout: 10000
            }).then(result => {
                res.send(result.data);
            }).catch(err => {
                res.send(err);
            });
            return;
        case 'POST':
            axios.post(`${req.query.host}${req.baseUrl}`, JSON.stringify(req.body), {
                headers: headers,
                timeout: 10000
            }).then(result => {
                res.send(result.data);
            }).catch(err => {
                res.send(err);
            });
        default:
            res.send({ status: false, err_code: 'Not support this method' });
    }
});
app.use('/', (req, res) => {
    res.send({ status: 'OK' })
});
var httpServer = http.createServer(app);
const port = process.env.PORT || '80';
httpServer.listen(port, () => console.log(`Server started on Port ${port}`));
