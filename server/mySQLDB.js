import 'dotenv';
import Sequelize from 'sequelize';

const dbName = 'maintanence';
const dbUserName = 'root';
const dbPassword = '199Sk2018';
const dbHost = 'localhost';
const dbPort = '3306';

const mySQLDB = new Sequelize(dbName, dbUserName, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
});

mySQLDB.sync().then(() => {
    console.log(`Database & tables created!`)
}).catch(err => {
    console.log(`Could not connect to database ${err}`);
});

export default mySQLDB;
