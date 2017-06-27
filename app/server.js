const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const fs = require('fs');
const app = express();

const GeoJSON = require('geojson');

const server = http.Server(app);

const ADDRESS = '127.0.0.1';
const PORT = process.env.PORT || 3000;

app.use(favicon(__dirname + '/public/icon/favicon.ico'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    const stream = fs.createReadStream(__dirname + '/index.html', { encoding: 'utf8' });
    stream.pipe(res);
});

app.post('/data', function(req, res) {
    return GeoJSON.parse(req.body, { Point: ['longitude', 'latitude'] });
});

server.listen(PORT, ADDRESS, function() {
    console.log('server running ...  at ' + ADDRESS + ':' + PORT);
});
