const url = require('url');
const http = require('http');
const path = require('path');
const responseEnd = require('../../helpers/responseEnd');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') !== -1) {
    responseEnd(400, 'Bad request', res);
  } else {
    switch (req.method) {
      case 'DELETE':
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          responseEnd(200, 'Deleted', res);
        } else {
          responseEnd(404, 'Not Found', res);
        }

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
