const bunyan = require("bunyan");
const obj = {};

if (!obj.log) {
  obj.log = bunyan.createLogger({ name: "whatis" });
}
module.exports = {
  log: obj.log,
};
