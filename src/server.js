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
const activitySpace = require('./routes/activity_space_routes');
const competency = require('./routes/competency_routes');
const practiceValidation = require('./routes/practice_validation_routes');
const publicPracticeValidation = require('./routes/public_practice_validation_routes');

const server = express();

const corsOptions = {
    credentials: true,
    origin: process.env.ALLOWED_ORIGIN
}
server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({extended: true }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, 'public')));

/*routes here*/
server.use('/account', accountRoutes);
server.use('/areas-of-concern', areaOfConcern);
server.use('/alphas', alpha);
server.use('/practices', practice);
server.use('/activity-spaces', activitySpace);
server.use('/competencies', competency);
server.use('/practice-validations', practiceValidation);
server.use('/practice-validations', publicPracticeValidation);

db.connectToDb().then(r => _console.info('then on connecting db'));

const port = process.env.SERVER_PORT || 3000;

server.listen(port, ()=>{
    _console.success(`Express server listening on port: ${port} `);
});