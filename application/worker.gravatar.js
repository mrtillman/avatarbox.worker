const { Worker } = require('./worker');
const { GravatarService } = require('../services/gravatar.service');

class GravatarWorker extends Worker {
  constructor(id, source){
    super(id, source);
    this.service = new GravatarService();
  }
  async execute(){
    return await this.service.update(this.id);
  }
}

module.exports = { GravatarWorker };
