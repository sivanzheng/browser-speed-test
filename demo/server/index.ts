import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';

const server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
    console.log(request.url);
    response.statusCode = 200;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'image/png');
    const img = path.resolve(__dirname, './test.png');
    fs.stat(img, (_, stat) => {
        if (stat.isFile()) {
            response.setHeader('Content-Length', stat.size);
        }
    });
    fs.createReadStream(img).pipe(response);
});

server.listen(3030, 'localhost');

console.log('service start!');
