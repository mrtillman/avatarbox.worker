const { GravatarWorker } = require('../application/worker.gravatar');
const { TwitterWorker } = require('../application/worker.twitter');

class WorkerFactory {
  getWorker(id, source){
    if(/gravatar/i.test(source)){
      return new GravatarWorker(id, source);
    } else if(/twitter/i.test(source)){
      return new TwitterWorker(id, source);
    }
  }
}

module.exports = { WorkerFactory };
