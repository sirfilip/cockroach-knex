const environment = process.env.NODE_ENV || 'development';

const config = require('../knexfile');
const envirnomentConfig = config[environment];
const knex = require('knex');
const connection = knex(envirnomentConfig);

module.exports = connection;
