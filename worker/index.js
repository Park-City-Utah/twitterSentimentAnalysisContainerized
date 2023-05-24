const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');



// const keys = require('./keys');
// const redis = require('redis');
// //const {spawn} = require('child_process');

// const redisClient = redis.createClient({
//     host: keys.redisHost,
//     port: keys.redisPort,
//     retry_strategy: () => 1000
// });

// const sub = redisClient.duplicate();//Redis required 2 conns

// function fib(index) {
//     if (index < 2) return 1;
//     return fib(index - 1) + fib(index - 2);
//   }


// // function funcTest(keyword){
// //     let result = keyword + 'updated';
// //     return result;
// // }

// // //ToDo: Input keyword from client UI 
// // let keyword = 'trump';

// // function sentimentAnalysis(keyword) {
// //     // spawn new child process to call the python script
// //     const python = spawn('python3', ['./scripts/TwitterSentimentAnalysis.py', keyword]);
// //     // collect data from script
// //     python.stdout.on('data', (data) => {
// //         console.log('Pipe data from python script ...');
// //         data = data.toString()
// //         console.log(data);
// //     });
// //     // Close event we are sure that stream from child process is closed
// //     python.on('close', (code) => {
// //     console.log(`child process close all stdio with code ${code}`);
// //     });
// // }
// // sentimentAnalysis(keyword);

// //Monitor redis queque for NEW values, call script
// sub.on('message', (channel, message) => {
//     redisClient.hset('values', message, fib(parseInt(message)));
//   });
// // sub.on('message', (channel, message) => {
// //     redis.redisClient.hset('values', message, funcTest(message));
// // })
// //Subscribe to new value insert (keyword input for analysis)
// sub.subscribe('insert');