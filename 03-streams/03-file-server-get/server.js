require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const rootPath = `http://${req.headers.host}`;

  const url = new URL(req.url, rootPath);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end('Bad request');
  }

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('end', () => res.end());

      stream.on('aborted', () => {
        stream.destroy();
      });

      stream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end(error.message);
        } else {
          res.statusCode = 500;
          res.end('Undefined error');
        }
      });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
