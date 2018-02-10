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
        req.app.get('db').query(
            "select purchases.name, purchases.address, users.email, " +
            "purchase_items.price, purchase_items.quantity, purchase_items.state " +
            "from purchases " +
            "inner join purchase_items on purchase_items.purchase_id = purchases.id " +
            "inner join users on users.id = purchases.user_id " +
            "order by purchase_items.price desc;"
        )
        .then(items => {
            res.json(items);
        });
    });
});

http.createServer(app).listen(3000);

