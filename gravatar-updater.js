const { 
  AvbxGravatarClient, 
  LoadNextImageUseCase 
} = require('avatarbox.sdk');

const PusherClient = require('./pusher.client');

class GravatarUpdater {
  constructor(){
    this.avbx = new AvbxGravatarClient();
    this.useCase = new LoadNextImageUseCase();
    this.shouldNotifyUser = true;
  }
  update(id){
    const { avbx, useCase } = this;
    return avbx.fetch(id)
          .then(loadNextImg)
          .then(getResult.bind(this))
          .then(resetAvbxIcon)
          .then(sendPusherNotification)
          .catch(handleError.bind(this));
    function loadNextImg(client) {
      if(!client) throw new Error(`user \"${id}\" not found`);
      useCase.client = client;
      return useCase.execute();
    }
    function getResult(result) {
      this.shouldNotifyUser = false;
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
    function handleError(err){
      if(useCase.client && this.shouldNotifyUser){
        const { email } = useCase.client;
        avbx.off(email);
        // TODO: notify user via SES
      }
      throw err;
    }
  }
}

module.exports = { GravatarUpdater };