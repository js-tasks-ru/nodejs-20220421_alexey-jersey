const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    const index = chunk.indexOf(os.EOL);
    const chunkToString = chunk.toString('utf-8');

    if (index === -1) {
      this.data += chunkToString;
    } else {
      const parts = chunkToString.split(os.EOL);
      parts.forEach((part, i) => {
        if (i === 0) {
          this.data += part;
          this.push(this.data);
        } else if (i !== parts.length - 1) {
          this.data = part;
          this.push(this.data);
        } else {
          this.data = part;
        }
      });
    }

    callback(null);
  }

  _flush(callback) {
    this.push(this.data);
    callback();
  }
}

module.exports = LineSplitStream;
