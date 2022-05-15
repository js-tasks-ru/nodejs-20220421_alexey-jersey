const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const responseEnd = require('../../helpers/responseEnd');

const server = new http.Server();

const storeFile = ({filepath, body, pathname, res}) => {
  const writeStream = fs.createWriteStream(filepath);
  writeStream.end(body);
  writeStream.on('finish', () => {
    res.statusCode = 201;
    responseEnd(201, `✅ File "${pathname}" added.`, res);
  });
  writeStream.on('error', () => {
    res.statusCode = 500;
    responseEnd(500, 'Undefined error', res);
  });
};

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') !== -1) {
    responseEnd(400, 'Bad request', res);
  } else if (fs.existsSync(filepath)) {
    responseEnd(409, 'File exist', res);
  } else {
    switch (req.method) {
      case 'POST':
        let data = null;
        req.on('data', (chunk) => data = chunk);
        req.on('end', () => {
          const limitedStream = new LimitSizeStream({limit: 10000, encoding: 'utf-8'});

          limitedStream.end(data);

          limitedStream.on('data', () => {
            storeFile({filepath, data, pathname, res});
          });

          limitedStream.on('error', (error) => {
            responseEnd(413, error.message, res);
          });
        });
        req.on('error', () => {
          responseEnd(500, 'Undefined error', res);
        });

        break;

      default:
        responseEnd(501, 'Not implemented', res);
    }
  }
});

module.exports = server;
