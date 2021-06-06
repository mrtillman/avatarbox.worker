const { Worker } = require('./worker');
const { AvbxTwitterClient } = require('avatarbox.sdk');
const { TwitterService } = require('../services/twitter.service');
const PusherService = require('../services/pusher.service');

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
    const pusher = new PusherService(id);
    pusher.send("Your Twitter icon was updated!");
  }
}

module.exports = { TwitterWorker };
