const express = require('express');
const http = require('http');
const app = express();
var bodyParser = require("body-parser");

var Sequelize = require('sequelize')
    , sequelize = new Sequelize('pgguide', 'postgres', '5oct1995', {
    dialect: "postgres",
    port:    5432
});
app.use(bodyParser.json());

sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    });

var User = sequelize.define('User', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    details: Sequelize.STRING,
    created_at: Sequelize.DATE,
    deleted_at: Sequelize.DATE
}, {
    tableName: 'users', //defining tables name
    timestamps: false    //deactivate the timestamp column
});


// ADDING USER INTO THE DB
sequelize.sync().then(function() {
    return User.create({
        email: 'kayleigh@gmail.com',
        password: '1234',
        details: 'sex => F'
    });
}).then(function(jane) {
    console.log(jane.get({
        plain: true
    }));

    http.createServer(app).listen(3000);
});