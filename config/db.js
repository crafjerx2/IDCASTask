require('dotenv').config();
const { Sequelize } = require('sequelize');


const sequelize  = new Sequelize('idasctask', 'root', '', {
  host: process.env.HOST,
  port: process.env.PORT,
  dialect: 'mysql',
  define: {
    timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


const dbConn = async function() {
  try {
      await sequelize.sync();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }    
}

module.exports = {
  sequelize,
  dbConn
}