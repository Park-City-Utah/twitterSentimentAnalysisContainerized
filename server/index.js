const keys  = require('./keys');
//import Func from '../client/src/Func';

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

//Table ceation
pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// //Table creation, if not exists, table is 'keyword' from user input
// pgClient.on("connect", (client) => {
//     client
//       //.query("CREATE TABLE IF NOT EXISTS values (keyword varchar(10))")
//       .catch((err) => console.error(err));
// });

//Redis Client
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

//Express route handlers

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  //Redis library doesn't have promist support, callback instead of async/await above
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});
// app.post('/values', async (req, res) => {
//   const keyword = req.body.keyword;

//   //Add to redis 
//   redisClient.hset('values', keyword, funcTest(keyword));
//   redisPublisher.publish('insert', keyword);
//   //Store keyword perminantly in postgres database
//   pgClient.query('INSERT INTO values VALUES($1)', [keyword]);

//   res.send({ working: true });
// }); 

app.listen(5000, err => {
  console.log('Listening')
});