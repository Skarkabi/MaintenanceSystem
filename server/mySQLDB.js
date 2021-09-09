import 'dotenv';
import Sequelize from 'sequelize';

const dbName = 'maintanence';
const dbUserName = 'root';
const dbPort = '3306';

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const mySQLDB = new Sequelize(dbName, dbUserName, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: dbPort,
    dialect: 'mysql',
});

mySQLDB.sync().then(() => {
    console.log(`Database & tables created!`)
}).catch(err => {
    console.log("TESTT IS");
console.log(process.env.DB_PASSWORD);
    console.log(`Could not connect to database ${err}`);
});

export default mySQLDB;
