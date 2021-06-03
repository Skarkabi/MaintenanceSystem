import 'dotenv';
import Sequelize from 'sequelize';

const dbName = 'calendar';
const dbUserName = 'root';
const dbPassword = 'mosjsfskmo1';
const dbHost = 'localhost';
const dbPort = '3306';

const mySQLDB = new Sequelize(dbName, dbUserName, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
});

mySQLDB.sync().then(() => {
    console.log(`Database & tables created!`)
})

export default mySQLDB;
