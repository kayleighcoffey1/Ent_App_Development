

const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser').json(); // for parsing request params for POST
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config.json');



// Connection
var Sequelize = require('sequelize')
    , sequelize = new Sequelize('pgguide', 'postgres', '5oct1995', {
    dialect: "postgres",
    port:    5432
});

sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    })


const appOptions = {
    port: 3000,
    token: null,
    headers:{
        authorization: null
    }
};

app.use(express.static('public', appOptions));
app.use(bodyParser); // parse incoming JSON post bodies.

http.createServer(app).listen(3000, () => console.log('Example app listening on port 3000!'));

//users
var Users = sequelize.define('USERS', {
    username: {type: Sequelize.STRING, primaryKey: true},
    password: {type: Sequelize.STRING, allowNull: false},
    access_key: {type: Sequelize.STRING, allowNull: true},
    secretkey: {type: Sequelize.STRING, allowNull: true}
}, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    tableName: 'users'
});

//products
var Products = sequelize.define('Products', {
    name: {type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true},
    price: {type: Sequelize.FLOAT, allowNull: false},
    category: {type: Sequelize.STRING, allowNull: false}
},{
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    tableName: 'products'
});

sequelize
    .sync()
    .then(() => {
        console.log('Connection has been established successfully.');


        // ROUTES
        // View products
        app.get('/api/products', (req, res) => {
            Products.findAll().then(items => {
                res.json(items);
            });
        });

       //REGISTER USER
        app.post('/register', (req, res) => {
            const username = req.body.username;
            const password = req.body.password;

            const insert = "INSERT INTO USERS (username, password) VALUES \
                            (:username, crypt(:password, gen_salt('bf', 8)) );";

            Users.sequelize.query(insert, { replacements: {username, password }},{type: sequelize.QueryTypes.INSERT}).then(() => {
                res.send(response("message", "Successfully registered"))
            });
        });

        // create a new product using a POST request
        app.put('/products', verifyToken, (req, res) => {
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if (err) {
                    res.sendStatus(401);
                } else {
                    res.json({
                        message: 'Access Granted',
                        authData
                    });
                }
            });
        });



// function to generate a JWT token with 3 hour lifespan
        app.post('/api/testlogin', (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            const select = "Select id FROM users WHERE username = lower(username) AND password = crypt(password, password);";

            sequelize.query(select, {replaceemts: {username, password}}, {type: sequelize.QueryTypes.SELECT})
                .then(function (users) {
                    jwt.sign({users}, 'secretkey', (err, token, authData) => {
                        exp: Math.floor(Date.now() / 1000) + (60 * 60);
                        res.json({
                            message: 'Access grated',
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            token
                        });
                    });
                });
        });
    });

// verifying the token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;

        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(401);
    }
};




