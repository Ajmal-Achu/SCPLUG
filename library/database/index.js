const { readFileSync, accessSync, writeFileSync } = require("fs")
const { join, dirname } = require("path")


const dbName = "json";
const file = {
  data: join(__dirname + "/database/data." + dbName),
  config: join(__dirname + "/settings//config." + dbName),
};

accessSync(file.data);
accessSync(file.config);

const db = {
  data: JSON.parse(readFileSync(file.data)),
  config: JSON.parse(readFileSync(file.config)),
};

setInterval(async() => {
  writeFileSync(file.data, JSON.stringify(db.data, null, 2));
  writeFileSync(file.config, JSON.stringify(db.config, null, 2));
}, 990);

module.exports = db
