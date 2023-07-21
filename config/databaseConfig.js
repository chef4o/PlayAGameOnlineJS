const mongoose = require('mongoose');
const {DB_IP, BKP_DB_IP, DB_PORT, DB_SCHEMA} = require('../local/env.json');

const DB_CONNECTION_STRING = `mongodb://${DB_IP}:${DB_PORT}/${DB_SCHEMA}`;
const BCK_DB_CONNECTION_STRING = `mongodb://${BKP_DB_IP}:${DB_PORT}/${DB_SCHEMA}`;
const DB_CONNECTION_SUCCESS = `Connection to database server ${DB_IP} has been established.`;
const BCK_DB_CONNECTION_SUCCESS = `Connection to database server ${BKP_DB_IP} has been established.`;
const DB_CONNECTION_RETRY = `Attempting a connection to the backup datatabse server ${BKP_DB_IP}.`;
const DB_CONNECTION_FAILURE = `Connection to database server ${DB_IP} has failed.`;
const BKP_DB_CONNECTION_FAILURE = `Connection to database server ${BKP_DB_IP} has failed.`;

module.exports = async (app) => {
    try {
        await mongoose.connect(DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });    
        console.log(DB_CONNECTION_SUCCESS);
    } catch (error) {
        console.log(DB_CONNECTION_FAILURE);
        console.error(error);
        try {
            console.log(DB_CONNECTION_RETRY);
            await mongoose.connect(BCK_DB_CONNECTION_STRING, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log(BCK_DB_CONNECTION_SUCCESS);
        } catch (error) {
            console.log(BKP_DB_CONNECTION_FAILURE);
            console.error(error);
            process.exit(1);
        }
    }
};