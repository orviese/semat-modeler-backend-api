require('dotenv/config')
const _console = require('consola');
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./setting/database');
const accountRoutes = require('./routes/account_routes');
const areaOfConcern = require('./routes/area_of_concern_routes');
const alpha = require('./routes/alpha_routes');
const practice = require('./routes/practice_routes');

const server = express();

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true }
server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({extended: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'public')));

/*routes here*/
server.use('/account', accountRoutes);
server.use('/area-of-concern', areaOfConcern);
server.use('/alphas', alpha);
server.use('/practices', practice);

db.connectToDb().then(r => _console.info('then on connecting db'));

const port = process.env.SERVER_PORT || 3000;

server.listen(port, ()=>{
    _console.success(`Express server listening on port: ${port} `);
});