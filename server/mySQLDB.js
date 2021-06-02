import Sequelize from 'sequelize';

const mySQLDB = new Sequelize('calendar', 'root', 'mosjsfskmo1', {
    host: 'localhost',
    dialect: 'mysql',
});

export default mySQLDB;