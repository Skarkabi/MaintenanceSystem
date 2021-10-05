import 'dotenv';
import Sequelize from 'sequelize';
import Importer from 'mysql-import';
const dbName = 'maintanence';
const dbUserName = 'root';
const dbPort = '3306';

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const mySQLDB = new Sequelize(dbName, dbUserName,process.env.DB_PASSWORD, {
    host: "localhost",
    port: dbPort,
    dialect: 'mysql',
});

const importer = new Importer({
    host: "localhost",
    user:dbUserName,
    password: process.env.DB_PASSWORD,
    database: dbName
})


mySQLDB.sync().then(() => {
    console.log(`Database & tables created!`)
    /*
    importer.onProgress(progress => {
        var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000)/100;
        console.log(`${percent}% Completed`);
    });
    
    importer.import('C:\\Users\\salee\\Documents\\TMI\\MaintenanceSystem\\newMaintenance').then(() => {
        var files_imported = importer.getImported();
        console.log(`${files_imported.length} SQL file(s) imported.`);
    }).catch(err => {
        console.log(err);
    });
    */
}).catch(err => {
    console.log("TESTT IS");
console.log(process.env.DB_PASSWORD);
    console.log(`Could not connect to database ${err}`);
});




export default mySQLDB;
