const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const handleResponseEnd = (code, message, res) => {
  res.statusCode = code;
  res.end(message);
};

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') !== -1) {
    handleResponseEnd(400, 'Bad request', res);
  } else {
    switch (req.method) {
      case 'DELETE':
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          handleResponseEnd(200, 'Deleted', res);
        } else {
          handleResponseEnd(404, 'Not Found', res);
        }

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
