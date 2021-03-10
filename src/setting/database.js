const mongoose = require('mongoose');
require('dotenv/config');
const _console = require('consola')

module.exports = {
    connectToDb: async () => {
        try{
            await mongoose.connect(process.env.DB_CONNECTION_URL, {
                useNewUrlParser: true, useUnifiedTopology: true
            });
            _console.success('Connected to db');
        }catch (e) {
            _console.error('Problems connecting to db', e);
        }
    }
}

