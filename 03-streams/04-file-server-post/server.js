const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const handleResponseEnd = (code, message, res) => {
  res.statusCode = code;
  res.end(message);
};

const storeFile = ({filepath, body, pathname, res}) => {
  const writeStream = fs.createWriteStream(filepath);
  writeStream.end(body);
  writeStream.on('finish', () => {
    res.statusCode = 201;
    handleResponseEnd(201, `✅ File "${pathname}" added.`, res);
  });
  writeStream.on('error', () => {
    res.statusCode = 500;
    handleResponseEnd(500, 'Undefined error', res);
  });
};

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') !== -1) {
    handleResponseEnd(400, 'Bad request', res);
  } else if (fs.existsSync(filepath)) {
    handleResponseEnd(409, 'File exist', res);
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
            handleResponseEnd(413, error.message, res);
          });
        });
        req.on('error', () => {
          handleResponseEnd(500, 'Undefined error', res);
        });

        break;

      default:
        handleResponseEnd(501, 'Not implemented', res);
    }
  }
});

module.exports = server;
