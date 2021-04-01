const { 
  AvbxGravatarClient, 
  LoadNextImageUseCase 
} = require('avatarbox.sdk');

const PusherClient = require('./pusher.client');

class GravatarUpdater {
  constructor(){
    this.avbx = new AvbxGravatarClient();
    this.useCase = new LoadNextImageUseCase();
  }
  update(id){
    const { avbx, useCase } = this;
    return avbx.fetch(id)
          .then(loadNextImg)
          .then(getResult)
          .then(resetAvbxIcon)
          .then(sendPusherNotification)
          .catch(handleError);

    function loadNextImg(client) {
      if(!client) throw new Error(`user \"${id}\" not found`);
      useCase.client = client;
      return useCase.execute();
    }
    function getResult(result) {
      return {
        imageUrl: `${result.url.replace("http:", "https:")}?size=450`,
        emailHash: useCase.client.emailHash,
        email: useCase.client.email
      }
    }
    function resetAvbxIcon(result){
      avbx.reset(result);
      return result;
    }
    function sendPusherNotification(result){
      const pusher = new PusherClient(result.emailHash);
      pusher.send("Your Gravatar was updated!");
    }
    async function handleError(err){
      if(!isNaN(id)){
        const user = await avbx.user.findById(id);
        if(user) {
          await avbx.off(user.email);
          // TODO: notify user via SES
        }
      }
      throw err;
    }
  }
}

module.exports = { GravatarUpdater };