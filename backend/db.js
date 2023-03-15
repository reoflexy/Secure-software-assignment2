const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];
const pg = require('pg');
const pool = new pg.Pool(config);
//const client = await pool.connect();

//console.log(config)
module.exports = {pool,pg,env,config}