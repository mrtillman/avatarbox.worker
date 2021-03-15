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

  const client = new AvbxGravatarClient();

  const useCase = new LoadNextImageUseCase();

  const record = event.Records.shift();

  const email = record.body;

  try {
    useCase.client = await client.fetch(email);
    const result = await useCase.execute();
    const imageUrl = `${result.url.replace("http:", "https:")}?size=450`;

    //TODO: image compare

    const pusher = new PusherClient(useCase.client.emailHash);
    
    pusher.send("Your Gravatar was updated!");

    await client.reset({
      email,
      imageUrl
    })
  } catch (err) {
    console.error('update failed: ', err);
    await client.off(email);
    
    // TODO: notify user via SES message

    throw err;
  }

};

exports.handler = handler;
