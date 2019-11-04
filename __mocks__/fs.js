const fs = jest.genMockFromModule('fs');
const _fs = jest.requireActual('fs');

Object.assign(fs, _fs);

const readMocks = {};

fs.setReadMock = (path, error, value) => {
  readMocks[path] = [error, value];
};

fs.readFile = (path, option, callback) => {
  if (callback === undefined) {
    callback = option
  }
  if (path in readMocks) {
    callback(...readMocks[path]);
  } else {
    _fs.readFile(path, option, callback)
  }
}

const writeMocks = {};
fs.setWriteMocks = (path, fn) => {
  writeMocks[path] = fn;
}

fs.writeFile = (path, data, options, callback) => {
  if (callback === undefined) callback = options

  if (path in writeMocks) {
    writeMocks[path](path, data, callback);
  } else {
    _fs.writeFile(path, data, options, callback);
  }
}
module.exports = fs
