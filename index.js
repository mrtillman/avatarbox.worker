const { GravatarUpdater } = require('./gravatar-updater');

const handler = (event) => {
  
  if(!event || !event.Records){
    console.info('ping!');
    return;
  }

  Promise.all(
    event.Records.map(record => {
      if(!record.body) return;
      const gravatarUpdater = new GravatarUpdater();
      return gravatarUpdater.update(record.body.toString());
    })
  ).catch(err => {
    console.error('update failed: ', err);
    throw err;
  });

};

exports.handler = handler;