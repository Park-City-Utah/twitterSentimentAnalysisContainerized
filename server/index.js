const keys  = require('./keys');

//Express
const express = require('express');
const bodyParser = require('body-parser');  
const cors = require('cors');

//App object for http response
const app = express();
app.use(cors());  //cross origing to make requests across post/domain
app.use(bodyParser.json()); //Parse body of request into json for express API

//Postgres Client 
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

//Error listener
pgClient.on('error', () => console.log('Lost PG connection'));

//Table creation, if not exists, table is 'keyword' from user input
pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (keyword varchar(255) NOT NULL)")
      .catch((err) => console.error(err));
  });