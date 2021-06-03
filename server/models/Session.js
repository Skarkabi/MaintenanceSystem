import Sequelize from 'sequelize';
 
import sequelize from '../mySQLDB';

/**
 * Sessions table is used to store user session persistently.
 * 
 *
 * Read more on https://www.npmjs.com/package/connect-session-sequelize
 */
const mappings = {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
};

const Session = sequelize.define('Session', mappings, {
  indexes: [
    {
      name: 'session_sid_index',
      method: 'BTREE',
      fields: ['sid'],
    },
  ],
});

export default Session;
