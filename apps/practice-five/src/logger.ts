
const fs = require("fs");
const path = require("path");

const logUserVisit = async (ip) => {
  const log = ip + "\n";
  const logFile = path.join(__dirname, "..", "visitors.txt");
  fs.appendFile(logFile, log, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = logUserVisit;
