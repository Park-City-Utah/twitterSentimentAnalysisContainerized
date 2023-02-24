const keys = require('./keys');
const redis = require('redis');
const {spawn} = require('child_process');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();//Redis required 2 conns

//ToDo: Input keyword from client UI 
let keyword = 'trump';

function sentimentAnalysis(keyword) {
    // spawn new child process to call the python script
    const python = spawn('python3', ['./scripts/TwitterSentimentAnalysis.py', keyword]);
    // collect data from script
    python.stdout.on('data', (data) => {
        console.log('Pipe data from python script ...');
        data = data.toString()
        console.log(data);

    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    });
}
sentimentAnalysis(keyword);

//Monitor redis quque for NEW values, call script
sub.on('message', () => {
    redis.redisClient.hset('values', message, sentimentAnalysis(message));
})
//Subscribe to new value insert (keyword input for analysis)
sub.subscribe('insert');