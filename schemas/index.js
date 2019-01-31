const mongoose = require('mongoose');
const config = require('config');
const cfg = config.get('cfg');

module.exports = () => {
  const connect = () => {
    if (cfg.env !== 'production') {
      mongoose.set('debug', true);
    }

    const user = cfg.mongo.user? (cfg.mongo.user + ':') : '';
    const password = cfg.mongo.password? (cfg.mongo.password + '@') : '';

    mongoose.connect(`mongodb://${user}${password}localhost:${cfg.mongo.port}/${cfg.mongo.database}`, {
      dbName: 'nodejs'
    }, (error) => {
      if (error) {
        console.error('mongo connection error', error)
      } else {
        console.log('mongo connection success')
      }
    });
  };

  connect();

  mongoose.connection.on('error', (error) => {
    console.error('mongo connection error', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.error('mongo is disconnected');
    connect();
  });

  require('./user');
  require('./comment');
};