const fs = require('fs');
const path = require('path');
const { pipeline } = require('node:stream/promises');
const { Transform } = require('stream');
const filePath = path.join(__dirname, 'output.txt');

const fileStream = fs.createWriteStream(filePath);

console.log('Hello! Enter text (or "exit" to end):');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    const input = chunk.toString().trim().toLowerCase();
    if (input === 'exit') {
      console.log('Goodbye!');
      process.exit();
    }
    this.push(chunk);
    callback();
  },
});

pipeline(process.stdin, myTransform, fileStream);

process.on('SIGINT', () => {
  console.log('Goodbye!');
  process.exit();
});
