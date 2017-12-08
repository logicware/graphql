import db from '../connect';
//console.log(db);

import tokenModel from './tokens';
import topicModel from './topics';
import userModel from './users';
import sessionModel from './sessions';

//const config = '../../config';


db.Token    = db.sequelize.import('Token', tokenModel);
db.Topic    = db.sequelize.import('Topic', topicModel);
db.User     = db.sequelize.import('User', userModel);
db.session  = db.sequelize.import('session', sessionModel);


Object.keys(db).forEach((key) => {
  const model = db[key];
  if (model.associate) {
    model.associate(db);
  }
});


export default db;

