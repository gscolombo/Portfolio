const fs = require("fs");

module.exports = (path, onSucess, onError) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      onError(err);
    } else {
      onSucess(data);
    }
  });
};
