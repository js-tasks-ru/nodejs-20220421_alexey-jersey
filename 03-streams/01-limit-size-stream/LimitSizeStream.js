const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.byteCount = 0;
  }

  _transform(chunk, encoding, callback) {
    this.byteCount += chunk.length;
    if (this.byteCount > this.limit) {
      callback(new LimitExceededError, null);
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
