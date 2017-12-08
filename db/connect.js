import Sequelize from 'sequelize';

import config from '../config'

//console.log(config);

const db = {};
let sequelize = null;

// use db from pg_url on local and staging for now
if (config.DATABASE_URL) {
  console.log('Connecting to Heroku Postgres');
  sequelize = new Sequelize(config.DATABASE_URL, {
    logging: false,
    dialectOptions: {
      ssl: true // for Heroku
    }
  });
} else {
  console.log('Connecting to Local Postgres');
  sequelize = new Sequelize(config.PG_URL, {
    logging: console.log
  });
}

db.sequelize  = sequelize;
db.Sequelize  = Sequelize;

export default db;



