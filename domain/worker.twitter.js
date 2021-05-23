const { Worker } = require('./worker');
const { AvbxTwitterClient } = require('avatarbox.sdk');
const { TwitterService } = require('../services/twitter.service');

class TwitterWorker extends Worker {
  constructor(id, source){
    super(id, source);
    this.client = new AvbxTwitterClient();
  }
  async execute(){
    const { id, client } = this;
    const profile = await client.fetch(id.toString());
    const twitterService = new TwitterService(profile);
    await twitterService.updateProfileIcon();
    await client.reset({ id, imageUrl: twitterService.imageUrl });
  }
}

module.exports = { TwitterWorker };
