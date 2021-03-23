const { 
  AvbxGravatarClient, 
  LoadNextImageUseCase 
} = require('avatarbox.sdk');
const PusherClient = require('./pusher.client');

const handler = async (event) => {
  
  if(!event || !event.Records){
    console.info('ping!');
    return;
  }

  const avbx = new AvbxGravatarClient();

  const useCase = new LoadNextImageUseCase();

  const record = event.Records.shift();

  const id = record.body.toString();

  try {

    useCase.client = await avbx.fetch(id);
    const result = await useCase.execute();
    const imageUrl = `${result.url.replace("http:", "https:")}?size=450`;
    
    //TODO: image compare

    const pusher = new PusherClient(useCase.client.emailHash);
    
    pusher.send("Your Gravatar was updated!");

    await avbx.reset({
      email: useCase.client.email,
      imageUrl
    })
    
  } catch (err) {
    console.error('update failed: ', err);
    const user = await avbx.user.findById(id);
    await avbx.off(user.email);
    
    // TODO: notify user via SES message

    throw err;
  }

};

exports.handler = handler;
