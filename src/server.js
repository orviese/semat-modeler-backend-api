require('dotenv/config')
const _console = require('consola');
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./setting/database');
const accountRoutes = require('./routes/account_routes');

const server = express();

const corsOptions = { credentials: true }
server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({extended: false }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());


/*routes here*/
server.use('/account', accountRoutes);


db.connectToDb().then(r => _console.info('then on connecting db'));

const port = process.env.SERVER_PORT || 3000;

server.listen(port, ()=>{
    _console.success(`Express server listening on port: ${port} `);
});