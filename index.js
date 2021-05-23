const { WorkerFactory } = require('./common/worker.factory');

const handler = (event) => {
  
  if(!event || !event.Records){
    console.info('ping!');
    return;
  }
  
  const factory = new WorkerFactory();

  Promise.all(
    event.Records.map(async record => {
      if(!record.body) return;
      const [ id, source ] = record.body.split(',');
      const worker = factory.getWorker(id, source);
      await worker.execute();
    })
  ).catch(err => {
    console.error('update failed: ', err);
    throw err;
  });

};

exports.handler = handler;