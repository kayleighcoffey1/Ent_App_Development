const express = require('express');
const app = express();

const http = require('http');
const massive = require('massive');

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: '5oct1995'
}).then(instance => {
    app.set('db', instance);

    app.get('/', (req, res) => {
        req.app.get('db').query("select email, details from users where id = $1", [1])
        .then(items => {
            res.json(items);
        });
    });
});

http.createServer(app).listen(3000);

