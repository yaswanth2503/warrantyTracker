const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const dbConfig = require("../config/config.js");
const basename = path.basename(__filename);
const ENV = process.env.NODE_ENV || "development";

const db = {};
let sequelize;

if (ENV == "development") {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging || false,
      ssl: dbConfig.ssl || false
    }
  );
} else {
    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: `/cloudsql/${dbConfig.hostcloud}`,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging || false,
        ssl: dbConfig.ssl || false
      }
   );
}



fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;