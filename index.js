// TODO: clean up / refactor
const { GravatarUpdater } = require('./gravatar-updater');
const { AvbxTwitterClient } = require('avatarbox.sdk');
const { TwitterService } = require('./services/twitter.service');

const handler = (event) => {
  
  if(!event || !event.Records){
    console.info('ping!');
    return;
  }
  
  Promise.all(
    event.Records.map(async record => {
      if(!record.body) return;
      const [ id, source ] = record.body.split(',');
      if(/gravatar/.test(source)){
        const gravatarUpdater = new GravatarUpdater();
        return await gravatarUpdater.update(id);
      } else {
        const client = new AvbxTwitterClient();
        const profile = await client.fetch(id.toString());
        const index = (profile.currentAvatarIndex + 1) % profile.avatars.length;
        const twitterService = new TwitterService(profile.token, profile.tokenSecret);
        const imageUrl = profile.avatars[index];
        await twitterService.updateProfileIcon(imageUrl);
        await client.reset({ id, imageUrl });
      }
    })
  ).catch(err => {
    console.error('update failed: ', err);
    throw err;
  });

};

exports.handler = handler;