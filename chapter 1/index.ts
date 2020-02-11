const fs = require('fs');

var stream = fs.createReadStream('../data/dummy_data.txt');
stream.setEncoding('utf8');

stream.on('data', function(chunk) { 
    chunk.toString('utf8');
    console.log(chunk);
});
