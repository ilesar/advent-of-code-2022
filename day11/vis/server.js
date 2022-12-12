
const fs = require("fs");
const http = require('http');
const url = require('url');

const requestListener = function (req, res) {
    const headers = {
        'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };
    var q = url.parse(req.url, true).query;
    const output = fs.readFileSync(`${__dirname}/${q.task}.csv`, "utf-8");
    res.writeHead(200, headers);
    res.end(output);
}

const server = http.createServer(requestListener);
server.listen(8080);
console.log('server listening on port 8080')