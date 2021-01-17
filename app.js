import {get_emotion} from "./brain_of_stilton.js";

const http = require('http');
const fs = require("fs");

get_emotion()

const hostname = '127.0.0.1';
const port = 3000;

const test = get_emotion("I am so happy");
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  // fs.createReadStream('index.html').pipe(res)
  res.end(test);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});