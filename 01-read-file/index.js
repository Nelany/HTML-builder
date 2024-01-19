const fs = require('fs');
const path = require('path');

let data = '';

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

readStream.on('data', (chunk) => {
  data += chunk;
});

readStream.on('end', () => {
  console.log(data);
});

readStream.on('error', (err) => {
  console.error(`Error reading the file: ${err}`);
});
