require('dotenv').config();
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.posts = require("./post.js")(sequelize, Sequelize);
db.comments = require("./comment.js")(sequelize, Sequelize);

db.users.hasMany(db.posts, {
  foreignKey : 'userId',
  targetKey: 'id'
});

db.posts.belongsTo(db.users, {
  foreignKey : 'userId',
  targetKey: 'id'
});

db.comments.belongsTo(db.users, {
  foreignKey : 'userId',
  targetKey: 'id'
});

db.comments.belongsTo(db.posts, {
  foreignKey : 'postId',
  targetKey: 'id'
});

module.exports = db;