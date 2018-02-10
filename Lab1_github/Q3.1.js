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
        var input_name = "Coloring Book";
        var sql = "select * from products where products.title = $1";

        req.app.get('db').query(
            sql, input_name

        )
        .then(items => {
            res.json(items);
        });
    });
});

http.createServer(app).listen(3000);

